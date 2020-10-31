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
			Email string
		}
		var data Data
		json.Unmarshal(jsonData, &data)
		//fmt.Print(data.Email)

		result, err := queries.GetDailyPicks(driver, data.Email)
		if err != nil {
			fmt.Print(err)
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

	}))

	app.GET("/picks/newResults", CheckAuthToken(func(c *gin.Context, _ string){

	}))

}