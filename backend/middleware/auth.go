package middleware

import (
	"github.com/gin-gonic/gin"
)

// FakeAuth is a placeholder middleware for future JWT validation.
// In MVP v1 it just passes through.
func FakeAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// TODO: validate JWT token from Authorization header
		// token := c.GetHeader("Authorization")
		c.Set("userID", "me")
		c.Next()
	}
}
