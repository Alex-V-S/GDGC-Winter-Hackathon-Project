import { NBATeam, NBAPlayer, NBAGame, BattleOpponent, LeaderboardEntry } from '../types/index';

// ── Teams ─────────────────────────────────────────────────────────
export const TEAMS: NBATeam[] = [
  { id: 't1', abbr: 'LAL', name: 'Lakers', city: 'Los Angeles', logo: '💜', color: '#552583' },
  { id: 't2', abbr: 'GSW', name: 'Warriors', city: 'Golden State', logo: '💛', color: '#1D428A' },
  { id: 't3', abbr: 'BOS', name: 'Celtics', city: 'Boston', logo: '☘️', color: '#007A33' },
  { id: 't4', abbr: 'MIL', name: 'Bucks', city: 'Milwaukee', logo: '🦌', color: '#00471B' },
  { id: 't5', abbr: 'PHX', name: 'Suns', city: 'Phoenix', logo: '☀️', color: '#E56020' },
  { id: 't6', abbr: 'DEN', name: 'Nuggets', city: 'Denver', logo: '⛏️', color: '#0E2240' },
  { id: 't7', abbr: 'DAL', name: 'Mavericks', city: 'Dallas', logo: '🐴', color: '#00538C' },
  { id: 't8', abbr: 'OKC', name: 'Thunder', city: 'Oklahoma City', logo: '⚡', color: '#007AC1' },
];

// ── Players ───────────────────────────────────────────────────────
export const PLAYERS: NBAPlayer[] = [
  {
    id: 'p1', name: 'LeBron James', team: 'LAL', position: 'SF', number: 23,
    ppg: 25.4, rpg: 7.9, apg: 8.1, fgPct: 50.2, threePct: 39.5,
    recentGames: [28, 22, 31, 24, 27], projection: 26,
  },
  {
    id: 'p2', name: 'Stephen Curry', team: 'GSW', position: 'PG', number: 30,
    ppg: 29.1, rpg: 5.5, apg: 6.4, fgPct: 47.8, threePct: 42.1,
    recentGames: [34, 26, 30, 28, 33], projection: 31,
  },
  {
    id: 'p3', name: 'Jayson Tatum', team: 'BOS', position: 'SF', number: 0,
    ppg: 27.2, rpg: 8.8, apg: 4.7, fgPct: 46.5, threePct: 37.8,
    recentGames: [30, 25, 29, 22, 32], projection: 28,
  },
  {
    id: 'p4', name: 'Giannis Antetokounmpo', team: 'MIL', position: 'PF', number: 34,
    ppg: 31.5, rpg: 11.8, apg: 5.9, fgPct: 55.3, threePct: 28.7,
    recentGames: [35, 28, 33, 30, 38], projection: 33,
  },
  {
    id: 'p5', name: 'Kevin Durant', team: 'PHX', position: 'PF', number: 35,
    ppg: 26.8, rpg: 6.7, apg: 5.2, fgPct: 52.1, threePct: 40.2,
    recentGames: [24, 30, 27, 25, 29], projection: 27,
  },
  {
    id: 'p6', name: 'Nikola Jokic', team: 'DEN', position: 'C', number: 15,
    ppg: 26.3, rpg: 12.4, apg: 9.1, fgPct: 58.2, threePct: 35.6,
    recentGames: [28, 24, 30, 26, 22], projection: 27,
  },
  {
    id: 'p7', name: 'Luka Doncic', team: 'DAL', position: 'PG', number: 77,
    ppg: 33.1, rpg: 9.2, apg: 9.8, fgPct: 48.7, threePct: 36.4,
    recentGames: [38, 30, 35, 28, 40], projection: 34,
  },
  {
    id: 'p8', name: 'Shai Gilgeous-Alexander', team: 'OKC', position: 'PG', number: 2,
    ppg: 30.8, rpg: 5.5, apg: 6.2, fgPct: 53.4, threePct: 35.1,
    recentGames: [32, 28, 34, 26, 30], projection: 31,
  },
];

// ── Games ─────────────────────────────────────────────────────────
export const GAMES: NBAGame[] = [
  {
    id: 'g1',
    homeTeam: TEAMS[0], // LAL
    awayTeam: TEAMS[1], // GSW
    date: 'Mar 3, 2026',
    time: '7:30 PM ET',
    arena: 'Crypto.com Arena',
    homeOdds: -110,
    awayOdds: +105,
    status: 'upcoming',
    topPlayers: [PLAYERS[0], PLAYERS[1]],
  },
  {
    id: 'g2',
    homeTeam: TEAMS[2], // BOS
    awayTeam: TEAMS[3], // MIL
    date: 'Mar 3, 2026',
    time: '8:00 PM ET',
    arena: 'TD Garden',
    homeOdds: -135,
    awayOdds: +120,
    status: 'upcoming',
    topPlayers: [PLAYERS[2], PLAYERS[3]],
  },
  {
    id: 'g3',
    homeTeam: TEAMS[4], // PHX
    awayTeam: TEAMS[5], // DEN
    date: 'Mar 4, 2026',
    time: '9:00 PM ET',
    arena: 'Footprint Center',
    homeOdds: +115,
    awayOdds: -125,
    status: 'upcoming',
    topPlayers: [PLAYERS[4], PLAYERS[5]],
  },
  {
    id: 'g4',
    homeTeam: TEAMS[6], // DAL
    awayTeam: TEAMS[7], // OKC
    date: 'Mar 4, 2026',
    time: '8:30 PM ET',
    arena: 'American Airlines Center',
    homeOdds: +100,
    awayOdds: -110,
    status: 'upcoming',
    topPlayers: [PLAYERS[6], PLAYERS[7]],
  },
  {
    id: 'g5',
    homeTeam: TEAMS[1], // GSW
    awayTeam: TEAMS[2], // BOS
    date: 'Mar 5, 2026',
    time: '10:00 PM ET',
    arena: 'Chase Center',
    homeOdds: -105,
    awayOdds: -105,
    status: 'upcoming',
    topPlayers: [PLAYERS[1], PLAYERS[2]],
  },
  {
    id: 'g6',
    homeTeam: TEAMS[3], // MIL
    awayTeam: TEAMS[0], // LAL
    date: 'Mar 5, 2026',
    time: '7:00 PM ET',
    arena: 'Fiserv Forum',
    homeOdds: -150,
    awayOdds: +135,
    status: 'upcoming',
    topPlayers: [PLAYERS[3], PLAYERS[0]],
  },
];

// ── Battle opponents ──────────────────────────────────────────────
export const MOCK_OPPONENTS: BattleOpponent[] = [
  { id: 'u1', name: 'HoopsMaster99', avatar: '🏀', level: 12 },
  { id: 'u2', name: 'DunkKing', avatar: '👑', level: 8 },
  { id: 'u3', name: 'BuzzerBeater', avatar: '⏰', level: 15 },
  { id: 'u4', name: 'CourtVision', avatar: '👁️', level: 10 },
];

// ── Leaderboard ───────────────────────────────────────────────────
export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: 'TripleDouble', avatar: '🏆', coins: 12400, wins: 87, level: 22 },
  { rank: 2, username: 'SlamDunkKing', avatar: '🔥', coins: 11200, wins: 82, level: 20 },
  { rank: 3, username: 'HoopsMaster99', avatar: '🏀', coins: 9800, wins: 74, level: 18 },
  { rank: 4, username: 'NetSwish', avatar: '🎯', coins: 8500, wins: 68, level: 16 },
  { rank: 5, username: 'CourtVision', avatar: '👁️', coins: 7200, wins: 61, level: 14 },
  { rank: 6, username: 'BuzzerBeater', avatar: '⏰', coins: 6100, wins: 55, level: 13 },
  { rank: 7, username: 'FastBreak', avatar: '⚡', coins: 5400, wins: 49, level: 11 },
  { rank: 8, username: 'DunkKing', avatar: '👑', coins: 4800, wins: 42, level: 10 },
  { rank: 9, username: 'AirBall', avatar: '💨', coins: 3200, wins: 30, level: 7 },
  { rank: 10, username: 'You', avatar: '🌟', coins: 2500, wins: 22, level: 5 },
];
