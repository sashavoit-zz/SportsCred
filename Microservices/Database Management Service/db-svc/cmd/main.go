package main

import (
	"log"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
)

const URI = "bolt://localhost:7687"
const DBNAME = "neo4j"
const DBPASS =  "1234"
const ENCRYPTED = false

func LoadAllPosts(driver neo4j.Driver)(interface{}, error){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return nil, err
	}
	defer session.Close()

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error){
		result, err := transaction.Run(
			"MATCH(p: Post) \n"+
				"CALL { \n" +
					"WITH p \n" +
					"MATCH(:User)-[likes:LIKES]->(p) \n"+
					"MATCH(:User)-[dislikes:DISLIKES]->(p) \n"+
					"RETURN toString(count(likes)) as likesNum, toString(count(dislikes)) as dislikesNum"+
				"} \n" +
				"RETURN collect({userId: p.userId, postId: toString(p.postId), content: p.content, time: p.time, likes: likesNum, dislikes: dislikesNum}) as posts",
			map[string]interface{}{})
		if err != nil {
			return nil, err
		}

		if result.Next() {
			value, _ := result.Record().Get("posts")
			return value, nil
		}else{
			return nil, nil
		}
	})

	return result, nil
}

func main(){
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

	app.GET("/allPosts", func(c *gin.Context){
		result, err := LoadAllPosts(driver)
		if err!=nil{
			c.String(500, "Internal server error")
			return
		}else if result == nil{
			c.String(404, "Not found")
			return
		}

		c.JSON(200, result)
	})

	app.Run(":3001")
}