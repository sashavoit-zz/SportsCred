package apis

import (
	"db-svc/queries"
	"encoding/json"
	"io/ioutil"
	"log"

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
type Comment struct {
	Content     string
	Email       string
	Likes       int
	Dislikes    int
	CommentTime string
}
type PostsUserRelationship struct {
	User    string
	Content string
}

func SetUpOpenCourt(app *gin.Engine, driver neo4j.Driver) {

	app.PUT("/posts/:userid/like/:postid", func(c *gin.Context) {
		email := c.Param("userid")
		postid := c.Param("postid")
		result, err := queries.RatePost(driver, email, postid, "like")
		if err != nil {
			c.String(500, "Internal server error")
			return
		} else if result == false {
			c.String(404, "Not found")
			return
		}
		c.JSON(200, result)
	})

	app.PUT("/posts/:userid/dislike/:postid", func(c *gin.Context) {
		email := c.Param("userid")
		postid := c.Param("postid")
		result, err := queries.RatePost(driver, email, postid, "dislike")
		if err != nil {
			c.String(500, "Internal server error")
			return
		} else if result == false {
			c.String(404, "Not found")
			return
		}
		c.JSON(200, result)
	})

	app.GET("/posts/:postid/likes", func(c *gin.Context) {
		postid := c.Param("postid")
		result, err := queries.GetLikes(driver, postid)
		if err != nil {
			c.String(500, "Internal server error")
			return
		}
		c.JSON(200, result)
	})
	app.GET("/posts/:postid/dislikes", func(c *gin.Context) {
		postid := c.Param("postid")
		result, err := queries.GetDislikes(driver, postid)
		if err != nil {
			c.String(500, "Internal server error")
			return
		}
		c.JSON(200, result)
	})

	app.GET("/allPosts", CheckAuthToken(func(c *gin.Context, _ string) {
		result, err := queries.LoadAllPosts(driver)
		if err != nil {
			c.String(500, "Internal server error")
			return
		} else if result == nil {
			c.String(404, "Not found")
			return
		}
		// log.Println("00000012")
		// log.Println(result)
		c.JSON(200, result)
	}))

	app.GET("/allPosts/:email", CheckAuthToken(func(c *gin.Context, _ string) {
		email := c.Param("email");
		result, err := queries.LoadPosts(driver, email)
		if err != nil {
			c.String(500, "Internal server error")
			return
		} else if result == nil {
			c.String(404, "Not found")
			return
		}
		log.Println("000000222")
		log.Println(result)
		c.JSON(200, result)
	}))

	app.GET("/post/:id", CheckAuthToken(func(c *gin.Context, _ string) {
		id := c.Param("id")
		// log.Println("000001")
		// log.Println(id)
		result, err := queries.LoadPost(driver, id)
		if err != nil {
			c.String(500, "Internal server error")
			return
		} else if result == nil {
			c.String(404, "Not found")
			return
		}
		// log.Println("0000001")
		// log.Println(result)
		c.JSON(200, result)
	}))

	app.GET("/postVisitor/:id", func(c *gin.Context) {
		id := c.Param("id")
		log.Println("000002")
		log.Println(id)
		result, err := queries.VisitorLoadPost(driver, id)
		if err != nil {
			c.String(500, "Internal server error")
			return
		} else if result == nil {
			c.String(404, "Not found")
			return
		}
		// log.Println("0000002")
		// log.Println(result)
		c.JSON(200, result)
	})

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
		result, err := queries.AddPost(driver, content, email, likes, dislikes, postTime)

		if err != nil {
			c.String(500, "Internal Error")
		} else if result == "" {
			c.String(400, "Bad Request")
		}
		c.JSON(200, result)
	}))

	app.POST("/reply/:postid/:hash", CheckAuthToken(func(c *gin.Context, _ string) {
		postid := c.Param("postid")
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			//handling error
		}
		var comment Comment
		json.Unmarshal(jsonData, &comment)
		content := comment.Content
		email := comment.Email
		likes := comment.Likes
		dislikes := comment.Dislikes
		commentTime := comment.CommentTime
		//add the user to the database
		result, err := queries.AddReply(driver, content, email, likes, dislikes, commentTime, postid)

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

	app.GET("/postReply/:postid", CheckAuthToken(func(c *gin.Context, _ string) {
		postid := c.Param("postid")
		result, err := queries.LoadPostReply(driver, postid)
		if err != nil {
			c.String(500, "Internal server error")
			return
		} else if result == nil {
			c.String(404, "Not found")
			return
		}

		c.JSON(200, result)
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
