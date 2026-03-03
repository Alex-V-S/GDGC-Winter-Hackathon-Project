// ── Type Definitions ────────────────────────────────────────────

export interface NBATeam {
  id: string;
  abbr: string;
  name: string;
  city: string;
  logo: string; // emoji placeholder for MVP
  color: string;
}

export interface NBAPlayer {
  id: string;
  name: string;
  team: string;
  position: string;
  number: number;
  ppg: number;
  rpg: number;
  apg: number;
  fgPct: number;
  threePct: number;
  recentGames: number[]; // points in last 5 games
  projection: number;
}

export interface NBAGame {
  id: string;
  homeTeam: NBATeam;
  awayTeam: NBATeam;
  date: string;
  time: string;
  arena: string;
  homeOdds: number;
  awayOdds: number;
  status: 'upcoming' | 'live' | 'finished';
  homeScore?: number;
  awayScore?: number;
  topPlayers: NBAPlayer[];
}

export interface BattleOpponent {
  id: string;
  name: string;
  avatar: string; // emoji placeholder
  level: number;
  prediction?: {
    winner: string;
    scoreDiff: number;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  coins: number;
  level: number;
  xp: number;
  xpToNext: number;
  wins: number;
  losses: number;
  streak: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  coins: number;
  wins: number;
  level: number;
}

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  GameDetails: { game: NBAGame };
  Battle: { game: NBAGame };
};

export type MainTabParamList = {
  Home: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};
