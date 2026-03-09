import { supabase } from './supabase';

export interface PlayerPredictionResponse {
  player: {
    name: string;
    team: string;
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

export const getPlayerPrediction = async (
  playerName: string,
  team: string
): Promise<PlayerPredictionResponse | null> => {
  try {
    const response = await fetch('http://localhost:8001/predict/points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_name: playerName, team }),
    });

    if (!response.ok) {
      throw new Error('ML service error');
    }

    return (await response.json()) as PlayerPredictionResponse;
  } catch (error) {
    console.log('ML service unavailable:', error);
    return null;
  }
};

export const scorePicks = async (gameId: string, winner: string): Promise<void> => {
  const { data: picks } = await supabase
    .from('picks')
    .select('*')
    .eq('game_id', gameId);

  for (const pick of picks || []) {
    const isCorrect = pick.predicted_winner === winner;

    await supabase
      .from('picks')
      .update({ is_correct: isCorrect })
      .eq('id', pick.id);

    const { data: profile } = await supabase
      .from('profiles')
      .select('fan_iq, streak')
      .eq('id', pick.user_id)
      .single();

    if (profile) {
      await supabase
        .from('profiles')
        .update({
          fan_iq: isCorrect ? profile.fan_iq + 10 : profile.fan_iq,
          streak: isCorrect ? profile.streak + 1 : 0,
        })
        .eq('id', pick.user_id);
    }
  }
};
