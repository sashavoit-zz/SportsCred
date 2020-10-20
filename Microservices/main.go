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
		Content       string
		Author        string
		AuthorProfile string
		Likes         int
		Dislikes      int
		PostTime      string
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
		author := post.Author
		authorProfile := post.AuthorProfile
		likes := post.Likes
		dislikes := post.Dislikes
		postTime := post.PostTime
		//add the user to the database
		result, err := addPost(driver, content, author, authorProfile, likes, dislikes, postTime)
		// result, err = addPostUserRelationship(driver, content, author)
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
	// app.GET("/getPost/:username", func(c *gin.Context) {
	// 	// bind
	// 	jsonData, err := ioutil.ReadAll(c.Request.Body)
	// 	if err != nil {
	// 		// Handle error
	// 	}
	// 	var relationship PostsUserRelationship
	// 	json.Unmarshal(jsonData, &relationship)

	// 	user := c.Param("username")

	// 	// get question from db
	// 	result, err := getPostByUser(driver, user)
	// 	if err != nil {
	// 		// 500 failed add user
	// 		c.String(500, "Internal Error")
	// 	} else if len(result) == 0 {
	// 		// 400 bad request (not exist or wrong password)
	// 		c.String(400, "Bad Request")
	// 		//c.JSON(400, gin.H{"message":"pong",})
	// 	}
	// 	c.JSON(200, gin.H{
	// 		"content":       result[0],
	// 		"author":        result[1],
	// 		"authorProfile": result[2],
	// 		"likes":         result[3],
	// 		"dislikes":      result[4],
	// 		"postTime":      result[5],
	// 	})
	// })
	//add relationship between user and post
	app.POST("/addPostUserRelationship/:hash", func(c *gin.Context) {
		// bind
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			// Handle error
		}
		var relationship PostsUserRelationship
		json.Unmarshal(jsonData, &relationship)

		content := relationship.Content
		user := relationship.User

		//add question to the database
		result, err := addPostUserRelationship(driver, content, user)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if result == "" {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}
		c.JSON(200, gin.H{
			"Note": "Relationship added successfully.",
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
func addPost(driver neo4j.Driver, content string, author string, authorProfile string, likes int, dislikes int, postTime string) (string, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"CREATE (n:Post {content:$content, author:$author, authorProfile:$authorProfile, likes:$likes, dislikes:$dislikes, postTime:$postTime})\n"+"WITH n \n"+"MATCH(u:User{name:$author})\n"+"WITH n,u\n"+"MERGE (u)-[r:CREATED]->", // or MERGE
			map[string]interface{}{"content": content, "author": author, "authorProfile": authorProfile, "likes": likes, "dislikes": dislikes, "postTime": postTime})
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

//add relationship between post and user
func addPostUserRelationship(driver neo4j.Driver, content string, user string) (string, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (u:User {name:$user}),(p:Post {content:$content})\n"+"MERGE (u)-[r:CREATED]->(p)\n"+"RETURN r", // or MERGE
			map[string]interface{}{"content": content, "user": user})
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

//helper function for testing, should be removed
func getPostByUser(driver neo4j.Driver, user string) ([7]string, error) {
	var res [7]string
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return res, err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (p:Post)-[r:Created]-(u:User{name:$user})]\n"+"RETURN p.content, p.author, p.authorProfile, p.likes, p.dislikes, p.postTime\n"+"LIMIT 1",
			map[string]interface{}{"user": user})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			res[0] = result.Record().GetByIndex(0).(string)
			res[1] = result.Record().GetByIndex(1).(string)
			res[2] = result.Record().GetByIndex(2).(string)
			res[3] = result.Record().GetByIndex(3).(string)
			res[4] = result.Record().GetByIndex(4).(string)
			res[5] = result.Record().GetByIndex(5).(string)
			return result.Record().GetByIndex(0), nil
		}
		return nil, result.Err()
	})
	resulter := result.(string)
	res[6] = resulter
	return res, nil
}
