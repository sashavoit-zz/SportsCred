package main

import (
	"db-svc/apis"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	"log"
)

//Assuming db is running on port 7687
const DBURI = "bolt://localhost:7687"
const DBNAME = "neo4j"
const DBPASS = "1234"
const ENCRYPTED = false

// need edit this become more safer
func CORSMiddleware() gin.HandlerFunc { 
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
		c.Header("Access-Control-Allow-Methods", "POST,HEAD,PATCH, OPTIONS, GET, PUT")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204) // 2xx code is fine
			return
		}
		c.Next()
	}
}


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
	app := gin.New()
	app.Use(CORSMiddleware())
	app.Use(gin.Logger())
	app.Use(gin.Recovery())
	apis.SetUpProfile(app, driver)
	apis.SetUpOpenCourt(app, driver)
	apis.SetUpTrivia(app, driver)

	app.Run(":3001")

}