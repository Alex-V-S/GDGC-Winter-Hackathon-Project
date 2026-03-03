package models

import "time"

// Team represents an NBA team.
type Team struct {
	ID    string `json:"id"`
	Abbr  string `json:"abbr"`
	Name  string `json:"name"`
	City  string `json:"city"`
	Logo  string `json:"logo"`
	Color string `json:"color"`
}

// Player represents an NBA player with stats.
type Player struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Team        string    `json:"team"`
	Position    string    `json:"position"`
	Number      int       `json:"number"`
	PPG         float64   `json:"ppg"`
	RPG         float64   `json:"rpg"`
	APG         float64   `json:"apg"`
	FGPct       float64   `json:"fg_pct"`
	ThreePct    float64   `json:"three_pct"`
	RecentGames []float64 `json:"recent_games"`
	Projection  float64   `json:"projection"`
}

// Game represents an NBA matchup.
type Game struct {
	ID         string   `json:"id"`
	HomeTeam   Team     `json:"home_team"`
	AwayTeam   Team     `json:"away_team"`
	Date       string   `json:"date"`
	Time       string   `json:"time"`
	Arena      string   `json:"arena"`
	HomeOdds   int      `json:"home_odds"`
	AwayOdds   int      `json:"away_odds"`
	Status     string   `json:"status"` // upcoming, live, finished
	HomeScore  *int     `json:"home_score,omitempty"`
	AwayScore  *int     `json:"away_score,omitempty"`
	TopPlayers []Player `json:"top_players"`
}

// User represents an app user.
type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Coins    int    `json:"coins"`
	Level    int    `json:"level"`
	XP       int    `json:"xp"`
	XPToNext int    `json:"xp_to_next"`
	Wins     int    `json:"wins"`
	Losses   int    `json:"losses"`
	Streak   int    `json:"streak"`
}

// Battle represents a prediction battle.
type Battle struct {
	ID          string    `json:"id"`
	GameID      string    `json:"game_id"`
	UserID      string    `json:"user_id"`
	Winner      string    `json:"winner"`       // team ID user picked
	ScoreDiff   int       `json:"score_diff"`
	Status      string    `json:"status"`        // pending, resolved
	Result      string    `json:"result"`        // win, loss
	CoinsEarned int       `json:"coins_earned"`
	CreatedAt   time.Time `json:"created_at"`
}

// LeaderboardEntry for ranking display.
type LeaderboardEntry struct {
	Rank     int    `json:"rank"`
	Username string `json:"username"`
	Avatar   string `json:"avatar"`
	Coins    int    `json:"coins"`
	Wins     int    `json:"wins"`
	Level    int    `json:"level"`
}
