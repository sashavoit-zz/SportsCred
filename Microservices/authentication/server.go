package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
)

var neo4jDriver neo4j.Driver // used in all db related funcs

func main() {
	// neo4j driver setup
	const URI = "bolt://localhost:7687"
	const DBNAME = "neo4j"
	const DBPASS = "1234"
	const ENCRYPTED = false

	var err error
	neo4jDriver, err = neo4j.NewDriver(URI, neo4j.BasicAuth(DBNAME, DBPASS, ""), func(c *neo4j.Config) {
		c.Encrypted = ENCRYPTED
	})
	if err != nil {
		fmt.Println("DB couldnt start")
	}
	defer neo4jDriver.Close()

	// server w default stuff like logger and error handlers
	server := gin.Default()

	// endpoints
	server.POST("/login", authorizeUser)
	server.GET("/get-user", checkAuthToken(getUser)) // protected routes

	// start server
	server.Run(":8080")
}
