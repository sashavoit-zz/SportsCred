package apis

import (
	"back-end/queries"
	"encoding/json"
	"io/ioutil"
	"log"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
)

//Bounds struct
type Bound struct {
	topBound    int
	bottomBound int
}

func SetUpLeaderboards(app *gin.Engine, driver neo4j.Driver) {

	app.GET("/getGlobalLeaderboard/:hash", CheckAuthToken(func(c *gin.Context, _ string) {
		// bind
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			// Handle error
		}
		var bounds Bound
		json.Unmarshal(jsonData, &bounds)

		//user := c.Param("username")

		// get question from db
		result, err := queries.GetGlobalLeaderboard(driver)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if len(result) == 0 {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}

		var mapping = make(gin.H)
		var i = 0

		for result[i] != "" {
			score, err := strconv.Atoi(result[i+1])
			if err != nil {
				// Handle error
			}
			mapping[result[i]] = score
			log.Println(result[i])
			log.Println(result[i+1])
			i++
			i++
		}

		c.JSON(200, mapping)
	}))

	app.GET("/getFanalystLeaderboard/:hash", CheckAuthToken(func(c *gin.Context, _ string) {
		// bind
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			// Handle error
		}
		var bounds Bound
		json.Unmarshal(jsonData, &bounds)

		//user := c.Param("username")

		// get question from db
		result, err := queries.GetFanalystLeaderboard(driver)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if len(result) == 0 {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}

		var mapping = make(gin.H)
		var i = 0

		for result[i] != "" {
			score, err := strconv.Atoi(result[i+1])
			if err != nil {
				// Handle error
			}
			mapping[result[i]] = score
			log.Println(result[i])
			i++
			i++
		}

		c.JSON(200, mapping)
	}))

	app.GET("/getAnalystLeaderboard/:hash", CheckAuthToken(func(c *gin.Context, _ string) {
		// bind
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			// Handle error
		}
		var bounds Bound
		json.Unmarshal(jsonData, &bounds)

		//user := c.Param("username")

		// get question from db
		result, err := queries.GetAnalystLeaderboard(driver)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if len(result) == 0 {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}

		var mapping = make(gin.H)
		var i = 0

		for result[i] != "" {
			score, err := strconv.Atoi(result[i+1])
			if err != nil {
				// Handle error
			}
			mapping[result[i]] = score
			log.Println(result[i])
			i++
			i++
		}

		c.JSON(200, mapping)
	}))

	app.GET("/getProAnalystLeaderboard/:hash", CheckAuthToken(func(c *gin.Context, _ string) {
		// bind
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			// Handle error
		}
		var bounds Bound
		json.Unmarshal(jsonData, &bounds)

		//user := c.Param("username")

		// get question from db
		result, err := queries.GetProAnalystLeaderboard(driver)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if len(result) == 0 {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}

		var mapping = make(gin.H)
		var i = 0

		for result[i] != "" {
			score, err := strconv.Atoi(result[i+1])
			if err != nil {
				// Handle error
			}
			mapping[result[i]] = score
			log.Println(result[i])
			i++
			i++
		}

		c.JSON(200, mapping)
	}))

	app.GET("/getExpertAnalystLeaderboard/:hash", CheckAuthToken(func(c *gin.Context, _ string) {
		// bind
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			// Handle error
		}
		var bounds Bound
		json.Unmarshal(jsonData, &bounds)

		//user := c.Param("username")

		// get question from db
		result, err := queries.GetExpertAnalystLeaderboard(driver)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if len(result) == 0 {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}

		var mapping = make(gin.H)
		var i = 0

		for result[i] != "" {
			score, err := strconv.Atoi(result[i+1])
			if err != nil {
				// Handle error
			}
			mapping[result[i]] = score
			log.Println(result[i])
			i++
			i++
		}

		c.JSON(200, mapping)
	}))

}
