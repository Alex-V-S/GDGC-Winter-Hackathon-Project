package handlers

import (
	"net/http"

	"nba-prediction-api/models"

	"github.com/gin-gonic/gin"
)

// Mock games data
var mockGames = []models.Game{
	{
		ID: "g1",
		HomeTeam: models.Team{ID: "t1", Abbr: "LAL", Name: "Lakers", City: "Los Angeles", Logo: "💜", Color: "#552583"},
		AwayTeam: models.Team{ID: "t2", Abbr: "GSW", Name: "Warriors", City: "Golden State", Logo: "💛", Color: "#1D428A"},
		Date: "Mar 3, 2026", Time: "7:30 PM ET", Arena: "Crypto.com Arena",
		HomeOdds: -110, AwayOdds: 105, Status: "upcoming",
		TopPlayers: []models.Player{
			{ID: "p1", Name: "LeBron James", Team: "LAL", Position: "SF", Number: 23, PPG: 25.4, RPG: 7.9, APG: 8.1, FGPct: 50.2, ThreePct: 39.5, RecentGames: []float64{28, 22, 31, 24, 27}, Projection: 26},
			{ID: "p2", Name: "Stephen Curry", Team: "GSW", Position: "PG", Number: 30, PPG: 29.1, RPG: 5.5, APG: 6.4, FGPct: 47.8, ThreePct: 42.1, RecentGames: []float64{34, 26, 30, 28, 33}, Projection: 31},
		},
	},
	{
		ID: "g2",
		HomeTeam: models.Team{ID: "t3", Abbr: "BOS", Name: "Celtics", City: "Boston", Logo: "☘️", Color: "#007A33"},
		AwayTeam: models.Team{ID: "t4", Abbr: "MIL", Name: "Bucks", City: "Milwaukee", Logo: "🦌", Color: "#00471B"},
		Date: "Mar 3, 2026", Time: "8:00 PM ET", Arena: "TD Garden",
		HomeOdds: -135, AwayOdds: 120, Status: "upcoming",
		TopPlayers: []models.Player{
			{ID: "p3", Name: "Jayson Tatum", Team: "BOS", Position: "SF", Number: 0, PPG: 27.2, RPG: 8.8, APG: 4.7, FGPct: 46.5, ThreePct: 37.8, RecentGames: []float64{30, 25, 29, 22, 32}, Projection: 28},
			{ID: "p4", Name: "Giannis Antetokounmpo", Team: "MIL", Position: "PF", Number: 34, PPG: 31.5, RPG: 11.8, APG: 5.9, FGPct: 55.3, ThreePct: 28.7, RecentGames: []float64{35, 28, 33, 30, 38}, Projection: 33},
		},
	},
}

// GetGames returns all upcoming NBA games.
func GetGames(c *gin.Context) {
	// Optional search filter
	q := c.Query("q")
	if q == "" {
		c.JSON(http.StatusOK, gin.H{"games": mockGames})
		return
	}

	var filtered []models.Game
	for _, g := range mockGames {
		if contains(g.HomeTeam.Name, q) || contains(g.AwayTeam.Name, q) || contains(g.Arena, q) {
			filtered = append(filtered, g)
		}
	}
	c.JSON(http.StatusOK, gin.H{"games": filtered})
}

// GetGame returns a single game by ID.
func GetGame(c *gin.Context) {
	id := c.Param("id")
	for _, g := range mockGames {
		if g.ID == id {
			c.JSON(http.StatusOK, g)
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "game not found"})
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(substr) == 0 ||
		(len(s) > 0 && len(substr) > 0 && stringContains(s, substr)))
}

func stringContains(s, sub string) bool {
	for i := 0; i <= len(s)-len(sub); i++ {
		if s[i:i+len(sub)] == sub {
			return true
		}
	}
	return false
}
