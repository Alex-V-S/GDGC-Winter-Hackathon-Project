package handlers

import (
	"net/http"

	"nba-prediction-api/models"

	"github.com/gin-gonic/gin"
)

// Mock user
var currentUser = models.User{
	ID:       "me",
	Username: "Rookie",
	Coins:    2500,
	Level:    5,
	XP:       320,
	XPToNext: 500,
	Wins:     22,
	Losses:   18,
	Streak:   3,
}

// Mock leaderboard
var leaderboard = []models.LeaderboardEntry{
	{Rank: 1, Username: "TripleDouble", Avatar: "🏆", Coins: 12400, Wins: 87, Level: 22},
	{Rank: 2, Username: "SlamDunkKing", Avatar: "🔥", Coins: 11200, Wins: 82, Level: 20},
	{Rank: 3, Username: "HoopsMaster99", Avatar: "🏀", Coins: 9800, Wins: 74, Level: 18},
	{Rank: 4, Username: "NetSwish", Avatar: "🎯", Coins: 8500, Wins: 68, Level: 16},
	{Rank: 5, Username: "CourtVision", Avatar: "👁️", Coins: 7200, Wins: 61, Level: 14},
	{Rank: 6, Username: "BuzzerBeater", Avatar: "⏰", Coins: 6100, Wins: 55, Level: 13},
	{Rank: 7, Username: "FastBreak", Avatar: "⚡", Coins: 5400, Wins: 49, Level: 11},
	{Rank: 8, Username: "DunkKing", Avatar: "👑", Coins: 4800, Wins: 42, Level: 10},
	{Rank: 9, Username: "AirBall", Avatar: "💨", Coins: 3200, Wins: 30, Level: 7},
	{Rank: 10, Username: "You", Avatar: "🌟", Coins: 2500, Wins: 22, Level: 5},
}

// GetProfile returns the current mock user.
func GetProfile(c *gin.Context) {
	c.JSON(http.StatusOK, currentUser)
}

// GetLeaderboard returns the mock leaderboard.
func GetLeaderboard(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"leaderboard": leaderboard})
}

// FakeLogin mocks authentication — just returns user data.
func FakeLogin(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Welcome to the arena!",
		"user":    currentUser,
		"token":   "mock-jwt-token-1234",
	})
}
