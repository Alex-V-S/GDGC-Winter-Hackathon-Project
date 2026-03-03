package handlers

import (
	"math/rand"
	"net/http"
	"time"

	"nba-prediction-api/models"

	"github.com/gin-gonic/gin"
)

// CreateBattleRequest is the payload for joining a battle.
type CreateBattleRequest struct {
	GameID    string `json:"game_id" binding:"required"`
	Winner    string `json:"winner" binding:"required"`
	ScoreDiff int    `json:"score_diff" binding:"required"`
}

// In-memory battles store (mock).
var battles []models.Battle

// CreateBattle creates a new prediction battle.
func CreateBattle(c *gin.Context) {
	var req CreateBattleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	battle := models.Battle{
		ID:        generateID(),
		GameID:    req.GameID,
		UserID:    "me", // mock user
		Winner:    req.Winner,
		ScoreDiff: req.ScoreDiff,
		Status:    "pending",
		CreatedAt: time.Now(),
	}

	battles = append(battles, battle)
	c.JSON(http.StatusCreated, battle)
}

// ResolveBattle mocks resolving a battle with random outcome.
func ResolveBattle(c *gin.Context) {
	id := c.Param("id")
	for i, b := range battles {
		if b.ID == id {
			// Mock: 60% win rate
			if rand.Float64() > 0.4 {
				battles[i].Result = "win"
				battles[i].CoinsEarned = 100
			} else {
				battles[i].Result = "loss"
				battles[i].CoinsEarned = 10
			}
			battles[i].Status = "resolved"
			c.JSON(http.StatusOK, battles[i])
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "battle not found"})
}

// GetBattles returns all battles for mock user.
func GetBattles(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"battles": battles})
}

func generateID() string {
	const letters = "abcdefghijklmnopqrstuvwxyz0123456789"
	b := make([]byte, 8)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}
