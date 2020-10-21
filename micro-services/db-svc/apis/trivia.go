package apis

import (
	"db-svc/queries"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	"io/ioutil"
)

//Question struct
type Question struct {
	Question string
	Option1  string
	Option2  string
	Option3  string
	Answer   string
}

// QuestionRelationship struct
type QuestionRelationship struct {
	Question string
	User     string
}

//check user and password, should use the hash inside url instead of json body
type Person struct {
	User     string
	Password string
}

func SetUpTrivia(app *gin.Engine, driver neo4j.Driver){

	app.POST("/addQuestion/:hash", func(c *gin.Context) {
		// bind
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			// Handle error
		}
		var questionStruct Question
		json.Unmarshal(jsonData, &questionStruct)

		question := questionStruct.Question
		option1 := questionStruct.Option1
		option2 := questionStruct.Option2
		option3 := questionStruct.Option3
		answer := questionStruct.Answer

		//add question to the database
		result, err := queries.AddQuestion(driver, question, option1, option2, option3, answer)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if result == "" {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}
		c.JSON(200, gin.H{
			"Note": "Question added successfully.",
		})
	})

	app.POST("/addQuestionRelationship/:hash", func(c *gin.Context) {
		// bind
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			// Handle error
		}
		var relationship QuestionRelationship
		json.Unmarshal(jsonData, &relationship)

		question := relationship.Question
		user := relationship.User

		//add question to the database
		result, err := queries.AddQuestionRelationship(driver, question, user)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if result == "" {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}
		c.JSON(200, gin.H{
			"Note": "Question added successfully.",
		})
	})

	app.GET("/getQuestion/:username/:hash", func(c *gin.Context) {
		// bind
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			// Handle error
		}
		var relationship QuestionRelationship
		json.Unmarshal(jsonData, &relationship)

		user := c.Param("username")

		// get question from db
		result, err := queries.GetQuestion(driver, user)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if len(result) == 0 {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}
		c.JSON(200, gin.H{
			"question": result[0],
			"option1":  result[1],
			"option2":  result[2],
			"option3":  result[3],
			"answer":   result[4],
		})
	})

	app.POST("/deleteQuestionRelationship/:hash", func(c *gin.Context) {
		// bind
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			// Handle error
		}
		var relationship QuestionRelationship
		json.Unmarshal(jsonData, &relationship)

		question := relationship.Question
		user := relationship.User

		//delete relationship from db
		result, err := queries.DeleteQuestionRelationship(driver, question, user)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if result == "" {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}
		c.JSON(200, gin.H{
			"Note": "Question removed successfully.",
		})
	})
}