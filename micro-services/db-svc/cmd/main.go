package main

import (
	"db-svc/apis"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	"log"
	"github.com/gin-contrib/cors"
)

//Assuming db is running on port 7687
const DBURI = "bolt://localhost:7687"
const DBNAME = "neo4j"
const DBPASS = "1234"
const ENCRYPTED = false



func main(){
	driver, err := neo4j.NewDriver(DBURI, neo4j.BasicAuth(DBNAME, DBPASS, ""), func(c *neo4j.Config) {
		c.Encrypted = ENCRYPTED
	})
	if err != nil {
		log.Fatal(err) // print error and stop
	}
	log.Println("Connected to Neo4j")
	defer driver.Close() // close connection when main function return

	//GIN router documentation here: https://github.com/gin-gonic/gin
	app := gin.Default()
	app.Use(cors.Default())
	app.Use(gin.Logger())
	app.Use(gin.Recovery())
	apis.SetUpProfile(app, driver)
	apis.SetUpOpenCourt(app, driver)
	apis.SetUpTrivia(app, driver)

	app.Run(":3001")

}