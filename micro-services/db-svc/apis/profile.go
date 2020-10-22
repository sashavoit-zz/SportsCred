package apis

import (
	"log"
	"db-svc/queries"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	"io/ioutil"
)

type Profile struct{
	FirstName string
	LastName string
	Email string
	Phone string
	About string
}



func SetUpProfile(app *gin.Engine, driver neo4j.Driver){

	
	//add a new post
	app.PATCH("/profile", CheckAuthToken(func(c *gin.Context, _ string){

		// bind
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
		    // Handle error
		}
		var profile Profile
		json.Unmarshal(jsonData, &profile)

		log.Println("333---")
		log.Println(profile.FirstName)
		log.Println(profile.LastName)
		log.Println(profile.Email)
		log.Println(profile.Phone)
		log.Println(profile.About)
		//err = client.Set("id", jsonData, 0).Err()
		firstName := profile.FirstName
		lastName := profile.LastName
		email := profile.Email
		phone := profile.Phone
		about := profile.About

		//add the user to the database
		result, err := queries.UpdateProfile(driver, firstName, lastName, email, phone, about)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		}else if result == ""{
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}
		c.JSON(200, gin.H{
			"good":  "this is how to send JSON to user",
		})
	}))

}