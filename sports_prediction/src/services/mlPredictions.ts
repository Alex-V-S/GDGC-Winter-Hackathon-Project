import { Platform } from 'react-native';

const ML_API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8000',
  ios: 'http://127.0.0.1:8000',
  default: 'http://127.0.0.1:8000',
}) as string;

export interface MlPredictionResponse {
  player: {
    id: string;
    name: string;
    team: string;
    position: string;
  };
  season_averages: {
    ppg: number;
    rpg: number;
    apg: number;
  };
  historical_performance: Array<{
    game_label: string;
    points: number;
  }>;
  prediction: {
    next_game_label: string;
    projected_points: number;
  };
}

export async function fetchPlayerPointsPrediction(
  playerName: string,
  team: string
): Promise<MlPredictionResponse | null> {
  try {
    const response = await fetch(`${ML_API_BASE_URL}/predict/points`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        player_name: playerName,
        team,
      }),
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as MlPredictionResponse;
  } catch {
    return null;
  }
}
