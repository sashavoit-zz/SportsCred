package apis

import (
	"db-svc/queries"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	"io/ioutil"
	"reflect"
	"time"
)


func SetUpPicks(app *gin.Engine, driver neo4j.Driver) {

	channels := make(map[string]chan int)
	const timeout = 3 * time.Hour

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
		}
		var data Data
		json.Unmarshal(jsonData, &data)

		result, err := queries.IfMadePrediction(driver, data.Email)
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
			Winner string `json:"winner"`
		}
		var data Data
		json.Unmarshal(jsonData, &data)

		_, err = queries.AddNewPrediction(driver, data.Email, data.GameId, data.Winner)
		if err != nil {
			c.String(500, "Internal server error")
			return
		}

		c.JSON(200, nil)
	}))


	app.GET("/picks/newResults", CheckAuthToken(func(c *gin.Context, _ string){
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		type Data struct {
			Email string `json:"email"`
		}
		var data Data
		json.Unmarshal(jsonData, &data)

		result, err := queries.GetNewResults(driver, data.Email)
		if err != nil {
			c.String(500, "Internal server error")
			return
		}
		if result == nil || reflect.ValueOf(result).IsNil() {

			//Waiting for new relevant data to appear
			channels[data.Email] = make(chan int)
			timer := make(chan int)
			go func(){
				time.Sleep(timeout)
				timer<-0
			}()
			for {
				select {
				case <- channels[data.Email]:
					result, err := queries.GetNewResults(driver, data.Email)
					if err != nil {
						c.String(500, "Internal server error")
						return
					}
					c.JSON(200, result)
					close(channels[data.Email])
					return
				case <- timer:
					c.JSON(408, nil)
					close(channels[data.Email])
					return
				}
			}
		}
		c.JSON(200, result)
	}))

	app.POST("/picks/addGame", CheckAuthToken(func(c *gin.Context, _ string){
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		type Data struct {
			Team1Name string `json:"team1_name"`
			Team2Name string `json:"team2_name"`
			Team1Init string `json:"team1_init"`
			Team2Init string `json:"team2_init"`
			Date string `json:"date"`
			Winner string `json:"winner"`
		}
		var data Data
		json.Unmarshal(jsonData, &data)

		result, err := queries.AddGame(driver, data.Team1Init, data.Team1Name, data.Team2Init, data.Team2Name, data.Date)

		if err != nil {
			c.String(500, "Internal server error")
			return
		}

		c.JSON(200, result)
	}))

	app.PATCH("/picks/updGameOutcome", CheckAuthToken(func(c *gin.Context, _ string){
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		type Data struct {
			GameId int `json:"game_id"`
			Winner string `json:"winner"`
		}
		var data Data
		json.Unmarshal(jsonData, &data)

		_, err = queries.AddGameOutcome(driver, data.GameId, data.Winner)
		if err != nil {
			c.String(500, "Internal server error")
			return
		}

		//Notifying channels that new data has been added
		go func(){
			emails, err := queries.GetUsersThatPredicted(driver, data.GameId)
			if err!=nil{
				return
			}
			for _, email := range emails{
				channels[email] <- data.GameId
			}
		}()

		c.JSON(200, nil)
	}))
}