package apis

import (
	"db-svc/queries"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	"io/ioutil"
)

//Maps user's email to respective channel
var chans map[string]chan int

//To check which channels are open
var openChans map[string]bool

//const timeout = 1 * time.Hour

var dbDriver neo4j.Driver

func SetUpNotifs(app *gin.Engine, driver neo4j.Driver){

	dbDriver = driver

	chans = make(map[string] chan int)
	openChans = make(map[string] bool)

	app.GET("/notifs/ifNewNotifs", CheckAuthToken(func(c *gin.Context, email string) {
		result := queries.IfNewNotifs(driver, email)
		c.JSON(200, result)
	}))

	app.GET("/notifs/getNotifs", CheckAuthToken(func(c *gin.Context, email string){
		result, err := queries.GetNotifs(driver, email)
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

	app.GET("/notifs/updNotifs", CheckAuthToken(func(c *gin.Context, email string){
		if queries.IfNewNotifs(driver, email){
			result, err := queries.GetNotifs(driver, email)
			if err != nil {
				c.String(500, "Internal server error")
				return
			} else if result == nil {
				c.String(404, "Not found")
				return
			}
			//fmt.Print(result)
			c.JSON(200, result)
		}else{
			fmt.Println("Opening a channel for " + email)
			chans[email] = make(chan int)
			fmt.Println("Opened a channel for " + email)
			openChans[email] = true

			select {
			case <-chans[email]:
				fmt.Println("Received something!")
				result, err := queries.GetNotifs(driver, email)
				if err != nil {
					c.String(500, "Internal server error")
					return
				}
				c.JSON(200, result)
				chans[email] = nil
				return
			}
		}
	}))

	app.POST("/notifs/addNotif", CheckAuthToken(func(c *gin.Context, email string){

		jsonData, err := ioutil.ReadAll(c.Request.Body)
		type Data struct {
			Email string `json:"email"`
			Title string `json:"title"`
			Content string `json:"content"`
			NotifType string `json:"type"`
		}
		var data Data
		json.Unmarshal(jsonData, &data)

		err = SendNotif(data.Email, data.Title, data.Content, data.NotifType)
		if err != nil {
			c.String(500, "Internal server error")
			return
		}
		c.JSON(200, nil)
	}))

	app.POST("/notifs/addInvitation", CheckAuthToken(func(c *gin.Context, email string){

		jsonData, err := ioutil.ReadAll(c.Request.Body)
		type Data struct {
			To string `json:"to"`
		}
		var data Data
		json.Unmarshal(jsonData, &data)

		err = SendTriviaInvitation(email, data.To)
		if err != nil {
			c.String(500, "Internal server error")
			return
		}
		c.JSON(200, nil)
	}))

	app.DELETE("/notifs/removeNotif", CheckAuthToken(func(c *gin.Context, email string){

		jsonData, err := ioutil.ReadAll(c.Request.Body)
		type Data struct {
			Id int `json:"id"`
		}
		var data Data
		json.Unmarshal(jsonData, &data)

		_, err = queries.RemoveNotif(driver, data.Id)
		if err != nil {
			c.String(500, "Internal server error")
			return
		}
		c.JSON(200, nil)
	}))
}

func SendNotif(email string, title string, content string, notifType string) error {
	_, err := queries.AddNotif(dbDriver, email, title, content, notifType, "")
	if openChans[email] {
		fmt.Println("Sending to channel for " + email)
		openChans[email] = false
		close(chans[email])
		fmt.Println("Sent to channel for " + email)
	}
	return err
}

func SendTriviaInvitation(from string, to string) error {
	_, err := queries.AddNotif(dbDriver, to, "Invitation to play trivia", "From " + from, "info", from)
	if openChans[to] {
		fmt.Println("Sending to channel for " + to)
		openChans[to] = false
		close(chans[to])
		fmt.Println("Sent to channel for " + to)
	}
	return err
}
