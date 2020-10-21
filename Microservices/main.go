package main

import (
	"fmt"
	"log"

	//"net/http"
	"io/ioutil"

	jsoniter "github.com/json-iterator/go"

	//"encoding/json"
	//"text/template"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
)

var json = jsoniter.ConfigCompatibleWithStandardLibrary

func main() {
	// db information
	URI := "bolt://localhost:7687"
	DBNAME := "neo4j"
	DBPASS := "1234"
	ENCRYPTED := false

	//db connection
	driver, err := neo4j.NewDriver(URI, neo4j.BasicAuth(DBNAME, DBPASS, ""), func(c *neo4j.Config) {
		c.Encrypted = ENCRYPTED
	})
	if err != nil {
		log.Fatal(err) // print error and stop
	}
	log.Println("Connected to Neo4j")
	defer driver.Close() // close connection when main function return

	//GIN router documentation here: https://github.com/gin-gonic/gin
	app := gin.New()
	app.Use(gin.Logger())
	app.Use(gin.Recovery())

	app.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	type Post struct {
		Content     string
		Email       string
		UserProfile string
		Likes       int
		Dislikes    int
		PostTime    string
	}
	type PostsUserRelationship struct {
		User    string
		Content string
	}
	//add a new post
	app.POST("/addPost/:hash", func(c *gin.Context) {
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			//handling error
		}
		var post Post
		json.Unmarshal(jsonData, &post)
		content := post.Content
		email := post.Email
		userProfile := post.UserProfile
		likes := post.Likes
		dislikes := post.Dislikes
		postTime := post.PostTime
		//add the user to the database
		result, err := addPost(driver, content, email, userProfile, likes, dislikes, postTime)

		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if result == "" {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}
		c.JSON(200, gin.H{
			"Note": "Post added successfully",
		})
	})

	//check user and password, should use the hash inside url instead of json body
	type Person struct {
		User     string
		Password string
	}
	//handleRequests()
	app.Run(":3001")
}

// add post in the database
func addPost(driver neo4j.Driver, content string, email string, userProfile string, likes int, dislikes int, postTime string) (string, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"CREATE (n:Post {content:$content, email:$email, userProfile:$userProfile, likes:$likes, dislikes:$dislikes, postTime:$postTime})\n"+
				"SET n.postId = id(n)\n"+
				"WITH n \n"+
				"MATCH(u:User{email:$email})\n"+
				"MERGE (u)-[r:CREATED]->(n)", // or MERGE
			map[string]interface{}{"content": content, "email": email, "userProfile": userProfile, "likes": likes, "dislikes": dislikes, "postTime": postTime})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}
		return nil, result.Err()
	})
	return fmt.Sprintf("%v", result), nil
}
