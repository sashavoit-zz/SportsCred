package apis

import (
	"db-svc/queries"
	"encoding/json"
	"io/ioutil"

	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
)

type Post struct {
	Content  string
	Email    string
	Likes    int
	Dislikes int
	PostTime string
}
type PostsUserRelationship struct {
	User    string
	Content string
}

func SetUpOpenCourt(app *gin.Engine, driver neo4j.Driver) {

	app.GET("/allPosts", CheckAuthToken(func(c *gin.Context, _ string) {
		result, err := queries.LoadAllPosts(driver)
		if err != nil {
			c.String(500, "Internal server error")
			return
		} else if result == nil {
			c.String(404, "Not found")
			return
		}

		c.JSON(200, result)
	}))

	//add a new post
	app.POST("/addPost/:hash", CheckAuthToken(func(c *gin.Context, _ string) {
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			//handling error
		}
		var post Post
		json.Unmarshal(jsonData, &post)
		content := post.Content
		email := post.Email
		likes := post.Likes
		dislikes := post.Dislikes
		postTime := post.PostTime
		//add the user to the database
		result, err := queries.AddPost(driver, content, email, likes, dislikes, postTime)

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
	}))

	app.GET("/getUserName/:email", CheckAuthToken(func(c *gin.Context, _ string) {
		email := c.Param("email")
		result, err := queries.GetUserNameByEmail(driver, email)

		if err != nil {
			c.String(500, "Internal server error")
			return
		} else if result == nil {
			c.String(404, "Not found")
			return
		}

		c.JSON(200, result)
	}))
}
