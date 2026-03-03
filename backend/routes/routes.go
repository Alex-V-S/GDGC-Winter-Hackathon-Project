package routes

import (
	"nba-prediction-api/handlers"

	"github.com/gin-gonic/gin"
)

// Setup registers all API routes.
func Setup(r *gin.Engine) {
	api := r.Group("/api/v1")
	{
		// Auth (mock)
		api.POST("/auth/login", handlers.FakeLogin)

		// Games
		api.GET("/games", handlers.GetGames)
		api.GET("/games/:id", handlers.GetGame)

		// Battles
		api.POST("/battles", handlers.CreateBattle)
		api.GET("/battles", handlers.GetBattles)
		api.POST("/battles/:id/resolve", handlers.ResolveBattle)

		// Users
		api.GET("/profile", handlers.GetProfile)
		api.GET("/leaderboard", handlers.GetLeaderboard)
	}
}
