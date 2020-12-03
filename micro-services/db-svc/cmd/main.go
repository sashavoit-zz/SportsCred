package main

import (
	"context"
	"db-svc/apis"
	"log"

	"cloud.google.com/go/storage"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	"google.golang.org/api/option"
)

//Assuming db is running on port 7687
const DBURI = "bolt://localhost:7687"
const DBNAME = "neo4j"
const DBPASS = "1234"
const ENCRYPTED = false

var (
	storageClient *storage.Client
)

func main() {
	driver, err := neo4j.NewDriver(DBURI, neo4j.BasicAuth(DBNAME, DBPASS, ""), func(c *neo4j.Config) {
		c.Encrypted = ENCRYPTED
	})
	if err != nil {
		log.Fatal(err) // print error and stop
	}
	log.Println("Connected to Neo4j")
	defer driver.Close() // close connection when main function return

	//set up connection with google cloud storage
	var e error
	ctx := context.Background()
	storageClient, e := storage.NewClient(ctx, option.WithCredentialsFile("keys.json"))
	if e != nil {
		log.Println("can not connect to google cloud storage")
	}

	//GIN router documentation here: https://github.com/gin-gonic/gin
	app := gin.Default()
	app.Use(cors.Default())
	app.Use(gin.Logger())
	app.Use(gin.Recovery())
	apis.SetUpProfile(app, driver, storageClient)
	apis.SetUpOpenCourt(app, driver, storageClient)
	apis.SetUpTrivia(app, driver)
	apis.SetUpAuth(app, driver)
	apis.SetUpSignUp(app, driver)
	log.Println("----------------------------------------")
	apis.SetUpSearch(app, driver)
	log.Println("----------------------------------------")
	apis.SetUpPicks(app, driver)
	apis.SetUpDebate(app, driver)
	apis.SetUpNotifs(app, driver)
	apis.SetUpLeaderboards(app, driver)
	apis.SetUpMultiplayerTrivia(app, driver)

	app.Run(":3001")

}
