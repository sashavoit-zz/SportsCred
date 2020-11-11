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
			Team1Logo string `json:"team1_logo"`
			Team2Logo string `json:"team2_logo"`
			Team1City string `json:"team1_city"`
			Team2City string `json:"team2_city"`
		}
		var data Data
		json.Unmarshal(jsonData, &data)

		result, err := queries.AddGame(driver, data.Team1Init, data.Team1Name, data.Team2Init, data.Team2Name, data.Date, "",
			data.Team1Logo, data.Team2Logo, data.Team1City, data.Team2City)

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

	queries.AddGame(driver, "UTA", "Utah Jazz", "NOP", "New Orleans Pelicans", "2020-11-30", "UTA",
		"https://ssl.gstatic.com/onebox/media/sports/logos/SP_dsmXEKFVZH5N1DQpZ4A_96x96.png",
		"https://ssl.gstatic.com/onebox/media/sports/logos/JCQO978-AWbg00TQUNPUVg_96x96.png",
		"https://i.pinimg.com/originals/94/ca/a5/94caa568233f04d0aa104d1be739c650.jpg",
		"https://i.pinimg.com/originals/37/bd/ff/37bdff0cb56f8b2f34e395121c7019ff.jpg")
	queries.AddGame(driver, "LAC", "Los Angeles Clippers", "LAL", "Los Angeles Lakers", "2020-11-30", "LAL",
		"https://ssl.gstatic.com/onebox/media/sports/logos/F36nQLCQ2FND3za-Eteeqg_96x96.png",
		"https://ssl.gstatic.com/onebox/media/sports/logos/4ndR-n-gall7_h3f7NYcpQ_96x96.png",
		"https://cdn.wallpapersafari.com/8/37/AIVuoY.jpg",
		"https://cdn.wallpapersafari.com/8/37/AIVuoY.jpg")
	queries.AddGame(driver, "ORL", "Orlando Magic", "BKN", "Brooklyn Nets", "2020-11-30", "ORL",
		"https://ssl.gstatic.com/onebox/media/sports/logos/p69oiJ4LDsvCJUDQ3wR9PQ_96x96.png",
		"https://ssl.gstatic.com/onebox/media/sports/logos/iishUmO7vbJBE7iK2CZCdw_96x96.png",
		"https://wallpapercave.com/wp/wp4117350.jpg",
		"https://wallpapercave.com/wp/wp4663832.jpg")
	queries.AddGame(driver, "MEM", "Memphis Grizzlies", "POR", "Portland Trailblazers", "2020-11-30", "POR",
		"https://ssl.gstatic.com/onebox/media/sports/logos/3ho45P8yNw-WmQ2m4A4TIA_96x96.png",
		"https://ssl.gstatic.com/onebox/media/sports/logos/_bgagBCd6ieOIt3INWRN_w_96x96.png",
		"https://static.wixstatic.com/media/fa3a6a_174653be72ad4c22923fc7e6adced1e5.jpg",
		"https://traveloregon.com/wp-content/uploads/2012/07/2200025-Edit.jpg")
	queries.AddGame(driver, "PHX", "Phoenix Suns", "WAS", "Washington Wizards", "2020-11-30", "PHX",
		"https://ssl.gstatic.com/onebox/media/sports/logos/pRr87i24KHWH0UuAc5EamQ_96x96.png",
		"https://ssl.gstatic.com/onebox/media/sports/logos/NBkMJapxft4V5kvufec4Jg_96x96.png",
		"https://i.pinimg.com/originals/64/c4/c4/64c4c4b5065f252f44aa04aacbcd8629.jpg",
		"https://i.pinimg.com/originals/5c/31/01/5c310196ca8ddd2ef90c9ef1d718873d.jpg")

}