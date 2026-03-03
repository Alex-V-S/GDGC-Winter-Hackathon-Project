from fastapi import FastAPI
from pydantic import BaseModel
import random # Temporary, until we hook up the real model

app = FastAPI(title="NBA Prediction ML Engine")

# This defines the JSON payload we expect to receive
class PredictionRequest(BaseModel):
    player_id: str
    team: str

@app.get("/")
def read_root():
    return {"status": "ML Engine is online and ready."}

@app.post("/predict/points")
def predict_points(request: PredictionRequest):
    """
    Receives a player ID, fetches their recent stats, 
    and returns a projected point value for the next game.
    """
    # TODO: 1. Use nba_api to fetch the player's last 10 games using request.player_id
    # TODO: 2. Clean the data with pandas
    # TODO: 3. Pass the cleaned data matrix into our trained ML model
    
    # For now, we return a mock prediction so the API contract is fulfilled
    mock_prediction = round(random.uniform(15.0, 35.0), 1)
    
    return {
        "player_id": request.player_id,
        "projected_points": mock_prediction,
        "confidence_score": 0.85 
    }