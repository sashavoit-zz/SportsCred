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
	timer := make(chan int)
	const timeout = 3 * time.Hour
	const regularUpd = 5*time.Second

	app.GET("/picks/dailyPicks", CheckAuthToken(func(c *gin.Context, email string){
		result, err := queries.GetDailyPicks(driver, email)
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

	app.GET("/picks/ifMadePrediction", CheckAuthToken(func(c *gin.Context, email string){
		result, err := queries.IfMadePrediction(driver, email)
		if err != nil {
			fmt.Print(err)
			c.String(500, "Internal server error")
			return
		}

		c.JSON(200, result)

	}))

	app.POST("/picks/newPrediction", CheckAuthToken(func(c *gin.Context, email string){
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		type Data struct {
			GameId int `json:"game_id"`
			Winner string `json:"winner"`
		}
		var data Data
		json.Unmarshal(jsonData, &data)

		_, err = queries.AddNewPrediction(driver, email, data.GameId, data.Winner)
		if err != nil {
			c.String(500, "Internal server error")
			return
		}

		//TODO remove after the demo
		//Setting a timer for the purpose of the demo
		go func(){
			time.Sleep(regularUpd)
			timer<-0
		}()

		c.JSON(200, nil)
	}))


	app.GET("/picks/newResults", CheckAuthToken(func(c *gin.Context, email string){
		result, err := queries.GetNewResults(driver, email)
		if err != nil {
			c.String(500, "Internal server error")
			return
		}
		if result == nil || reflect.ValueOf(result).IsNil() {

			//Waiting for new relevant data to appear
			channels[email] = make(chan int)
			defer close(channels[email])
			go func(){
				time.Sleep(timeout)
				timer<-0
			}()
			for {
				select {
				case <- channels[email]:
					result, err := queries.GetNewResults(driver, email)
					if err != nil {
						c.String(500, "Internal server error")
						return
					}
					c.JSON(200, result)
					close(channels[email])
					return
				case <- timer:
					result, err := queries.GetNewResults(driver, email)
					if err != nil {
						c.String(500, "Internal server error")
						return
					}
					c.JSON(200, result)
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

		result, err := queries.AddGame(driver, data.Team1Init, data.Team1Name, data.Team2Init, data.Team2Name, data.Date, "")

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

	//TODO remove after the demo
	//Running this for the sprint 2 demo
	demoScript(driver)
}

//TODO remove after the demo
func demoScript(driver neo4j.Driver){

	queries.ClearGamesInDB(driver)

	queries.AddGame(driver, "UTA", "Utah Jazz", "NOP", "New Orleans Pelicans", "2020-11-30", "UTA");
	queries.AddGame(driver, "LAC", "Los Angeles Clippers", "LAL", "Los Angeles Lakers", "2020-11-30", "LAL");
	queries.AddGame(driver, "ORL", "Orlando Magic", "BKN", "Brooklyn Nets", "2020-11-30", "ORL");
	queries.AddGame(driver, "MEM", "Memphis Grizzlies", "POR", "Portland Trailblazers", "2020-11-30", "POR");
	queries.AddGame(driver, "PHX", "Phoenix Suns", "WAS", "Washington Wizards", "2020-11-30", "PHX");

}