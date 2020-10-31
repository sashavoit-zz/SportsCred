package apis

import (
	"db-svc/queries"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	"io/ioutil"
)

func SetUpPicks(app *gin.Engine, driver neo4j.Driver) {

	app.GET("/picks/dailyPicks", CheckAuthToken(func(c *gin.Context, _ string){
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		type Data struct {
			Email string `json:"email"`
		}
		var data Data
		json.Unmarshal(jsonData, &data)
		//fmt.Print(data.Email)

		result, err := queries.GetDailyPicks(driver, data.Email)
		if err != nil {
			c.String(500, "Internal server error")
			return
		} else if result == nil {
			c.String(404, "Not found")
			return
		}
		//fmt.Print(result)
		c.JSON(200, result)
	}))

	app.GET("/picks/ifMadePrediction", CheckAuthToken(func(c *gin.Context, _ string){
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		type Data struct {
			Email string `json:"email"`
			Date string `json:"date"`
		}
		var data Data
		json.Unmarshal(jsonData, &data)

		result, err := queries.IfMadePrediction(driver, data.Email, data.Date)
		if err != nil {
			fmt.Print(err)
			c.String(500, "Internal server error")
			return
		}

		c.JSON(200, result)

	}))

	app.POST("/picks/newPrediction", CheckAuthToken(func(c *gin.Context, _ string){
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		type Data struct {
			Email string `json:"email"`
			GameId int `json:"game_id"`
			Prediction string `json:"prediction"`
		}
		var data Data
		json.Unmarshal(jsonData, &data)

		_, err = queries.AddNewPrediction(driver, data.Email, data.GameId, data.Prediction)
		if err != nil {
			c.String(500, "Internal server error")
			return
		}

		c.JSON(200, nil)

	}))

}