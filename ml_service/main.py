import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from nba_api.stats.static import players
from nba_api.stats.endpoints import playergamelog
import random

app = FastAPI(title="NBA Prediction ML Engine")

# This defines the JSON payload we expect to receive
class PredictionRequest(BaseModel):
    player_name: str
    team: str

@app.get("/")
def read_root():
    return {"status": "ML Engine is online and ready."}

def calculate_ml_prediction(df: pd.DataFrame) -> float:
    """
    Uses Multiple Linear Regression to forecast points based on 
    the game's time index, recent assists, and recent rebounds.
    """
    if df.empty or len(df) < 2:
        return 0.0
        
    # 1. Prepare the Data (Oldest game at index 0)
    df_reversed = df.iloc[::-1].reset_index(drop=True)
    
    # 2. Build the m x n Feature Matrix (X) and Target Vector (y)
    # X columns: [Time Index, Assists, Rebounds]
    X = np.zeros((len(df_reversed), 3))
    X[:, 0] = df_reversed.index
    X[:, 1] = df_reversed['AST'].values
    X[:, 2] = df_reversed['REB'].values
    
    y = df_reversed['PTS'].values 
    
    # 3. Initialize and Train the Multivariable Model
    model = LinearRegression()
    model.fit(X, y) # Calculates the optimal weights for all 3 features
    
    # 4. Create the input vector for the next game
    # We use the next time index, plus their moving averages for AST and REB
    next_index = len(df)
    avg_ast = df_reversed['AST'].mean()
    avg_reb = df_reversed['REB'].mean()
    
    next_game_vector = np.array([[next_index, avg_ast, avg_reb]])
    
    # 5. Apply the linear transformation to get the forecasted points
    prediction = model.predict(next_game_vector)
    
    return round(float(prediction[0]), 1)
@app.post("/predict/points")
def predict_points(request: PredictionRequest):
    try:
        # 1. Fetch the real DataFrame using the function we just built
        df = fetch_last_10_games(request.player_name)
        
        # 2. Print the matrix to your terminal so you can see the raw data!
        print(f"\n--- REAL DATA FOR {request.player_name.upper()} ---")
        print(df[['GAME_DATE', 'MATCHUP', 'PTS', 'REB', 'AST']].head(5))
        print("-----------------------------------------\n")
        
        # 3. Calculate real averages from the 10-game subset
        ppg = round(df['PTS'].mean(), 1)
        rpg = round(df['REB'].mean(), 1)
        apg = round(df['AST'].mean(), 1)
        
        # 4. Format the last 5 games for the frontend chart 
        # (We reverse it with [::-1] so the oldest game is G1 on the left side of the chart)
        last_5 = df.head(5).iloc[::-1].reset_index()
        historical_data = []
        for i, row in last_5.iterrows():
            historical_data.append({
                "game_label": f"G{i+1}",
                "points": int(row['PTS'])
            })
            
        # 5. Generate the ML projection using our Scikit-Learn model!
        ml_projection = calculate_ml_prediction(df)
        
        # 6. Return the exact JSON contract your Swift teammate needs
        return {
            "player": {
                "id": str(df['Player_ID'].iloc[0]), # Grabbing the real NBA ID
                "name": request.player_name,
                "team": request.team,
                "position": "N/A" # The gamelog doesn't include position, so we bypass it for now
            },
            "season_averages": {
                "ppg": ppg,
                "rpg": rpg,
                "apg": apg
            },
            "historical_performance": historical_data,
            "prediction": {
                "next_game_label": "Proj",
                "projected_points": ml_projection
            }
        }
        
    except Exception as e:
        # 1. Print the exact error to the terminal so we can debug it
        print(f"\n[WARNING] NBA API failed for {request.player_name}: {str(e)}")
        print("Falling back to mock data so the frontend doesn't crash!\n")
        
        # 2. Return safe mock data if the NBA servers time out
        return {
            "player": {
                "id": "mock_123",
                "name": request.player_name,
                "team": request.team,
                "position": "N/A"
            },
            "season_averages": {
                "ppg": 25.0,
                "rpg": 5.0,
                "apg": 5.0
            },
            "historical_performance": [
                { "game_label": "G1", "points": 20 },
                { "game_label": "G2", "points": 25 },
                { "game_label": "G3", "points": 22 },
                { "game_label": "G4", "points": 28 },
                { "game_label": "G5", "points": 24 }
            ],
            "prediction": {
                "next_game_label": "Proj",
                "projected_points": 26.5
            }
        }
    
def fetch_last_10_games(player_name: str) -> pd.DataFrame:
    """
    Finds a player by name, fetches their current season game log,
    and returns their last 10 games as a Pandas DataFrame matrix.
    """
    # 1. Search the static NBA players list for the matching name
    nba_players = players.get_players()
    player_dict = next((p for p in nba_players if p['full_name'].lower() == player_name.lower()), None)
    
    if not player_dict:
        raise HTTPException(status_code=404, detail="Player not found")
        
    player_id = player_dict['id']
    
    # 2. Query the NBA API for that specific player's game log
    # Note: nba_api defaults to the current season automatically
    gamelog = playergamelog.PlayerGameLog(player_id=player_id)
    
    # 3. Extract the data into a Pandas DataFrame
    df = gamelog.get_data_frames()[0]
    
    # 4. Return just the top 10 most recent games
    return df.head(10)

# --- TEMPORARY TEST BLOCK ---
# USE to test ml math with "dummy data" if NBA api is acting up and times you out
if __name__ == "__main__":
    import pandas as pd
    
    # Dummy matrix: Points go up, but AST and REB fluctuate wildly
    dummy_data = {
        'GAME_DATE': ['MAR 04', 'MAR 02', 'FEB 28', 'FEB 26', 'FEB 24'],
        'MATCHUP': ['GSW vs. LAL', 'GSW @ DEN', 'GSW vs. PHX', 'GSW @ DAL', 'GSW vs. MIL'],
        'PTS': [32, 26, 25, 20, 18], # Broken the perfect trend!
        'REB': [2, 11, 3, 12, 1],   
        'AST': [1, 9, 2, 10, 2]     
    }
    
    dummy_df = pd.DataFrame(dummy_data)
    
    print("\n--- SYNTHETIC PLAYER DATA ---")
    print(dummy_df)
    
    projected_score = calculate_ml_prediction(dummy_df)
    
    print(f"\n📈 SCORING TREND: 18 -> 21 -> 24 -> 27 -> 30")
    print(f"🤖 MULTIVARIABLE ML PREDICTION: {projected_score} points\n")