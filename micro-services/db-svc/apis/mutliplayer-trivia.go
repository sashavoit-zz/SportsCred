package apis

import (
	"db-svc/queries"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	"io/ioutil"
	"time"
)
const questionDuration = time.Second*20

type Room struct {
	First Player
	Second Player
}

type Response struct{
	Event string `json:"event"`
	/*
		Event can be: Joined/Start/Next/Answer/Left
	 */

	Data interface{} `json:"data"`
	/*
	Data can be of type:
		Player - in case of events: Joined
		Question - in case of event: Start, Next
		Answer - in case of event: Answered
		nil - in case of event: Left
	 */
}

type Player struct{
	Email string `json:"email"`
}

type Answer struct{
	PlayerAnswered Player `json:"playerAnswered"`
	AnswerChoice string `json:"answerChoice"`
}

var rooms map[string] Room
//var timers map[string] *time.Timer
var waitForResponse map[string] chan Response

func SetUpMultiplayerTrivia(app *gin.Engine, driver neo4j.Driver){
	rooms = make(map[string] Room)
	waitForResponse = make(map[string] chan Response)

	app.POST("multiplayerTrivia/joined", CheckAuthToken(func(c *gin.Context, email string){
		//INFORM BACK END THAT PLAYER JOINED THE GAME. HAVE TO PROVIDE OTHER PLAYER'S EMAIL
		jsonData, _ := ioutil.ReadAll(c.Request.Body)
		type Data struct {
			AnotherPlayer string `json:"anotherPlayer"`
		}
		var data Data
		json.Unmarshal(jsonData, &data)

		if room, ok := rooms[data.AnotherPlayer]; ok {
			rooms[email] = room
			waitForResponse[email] = make(chan Response)
			waitForResponse[data.AnotherPlayer] <- Response{"Joined", Player{email}}
		}else{
			waitForResponse[email] = make(chan Response)
			rooms[email] = Room{Player{email}, Player{data.AnotherPlayer}}
		}
		c.JSON(200, nil)
	}))

	app.POST("multiplayerTrivia/start", CheckAuthToken(func(c *gin.Context, email string){
		//INFORM BACK END THAT ONE OF THE PLAYERS STARTED THE GAME
		if _, ok := rooms[email]; !ok {
			c.JSON(400, nil)
			return
		}
		room := rooms[email]

		nextQuestion := fetchNextQuestion(room, driver)
		response := Response{"Start", nextQuestion}

		waitForResponse[room.First.Email] <- response
		waitForResponse[room.Second.Email] <- response
		//startTimers(room)
		queries.DeleteQuestionRelationship(driver, nextQuestion.Question, room.First.Email)
		queries.DeleteQuestionRelationship(driver, nextQuestion.Question, room.Second.Email)

		c.JSON(200, nil)
	}))

	app.POST("multiplayerTrivia/answer", CheckAuthToken(func(c *gin.Context, email string){
		//INFORM BACK END THAT ONE OF THE PLAYERS ANSWERED A QUESTION
		if _, ok := rooms[email]; !ok {
			c.JSON(400, nil)
			return
		}
		room := rooms[email]

		jsonData, _ := ioutil.ReadAll(c.Request.Body)
		type Data struct {
			AnswerChoice string `json:"answerChoice"`
		}
		var data Data
		json.Unmarshal(jsonData, &data)

		answer := Answer{Player{email}, data.AnswerChoice}
		response := Response{"Answer", answer}
		waitForResponse[room.First.Email] <- response
		waitForResponse[room.Second.Email] <- response
		//stopTimers(room)

		c.JSON(200, nil)
	}))

	app.POST("multiplayerTrivia/next", CheckAuthToken(func(c *gin.Context, email string){
		//INFORM BACK END THAT ONE OF THE PLAYERS PRESSED NEXT QUESTION BUTTON
		if _, ok := rooms[email]; !ok {
			c.JSON(400, nil)
			return
		}
		room := rooms[email]

		nextQuestion := fetchNextQuestion(room, driver)
		response := Response{"Next", nextQuestion}
		waitForResponse[room.First.Email] <- response
		waitForResponse[room.Second.Email] <- response
		//startTimers(room)
		queries.DeleteQuestionRelationship(driver, nextQuestion.Question, room.First.Email)
		queries.DeleteQuestionRelationship(driver, nextQuestion.Question, room.Second.Email)

		c.JSON(200, nil)
	}))

	app.POST("multiplayerTrivia/left", CheckAuthToken(func(c *gin.Context, email string){
		//INFORM BACK END THAT ONE OF THE PLAYERS PRESSED NEXT QUESTION BUTTON
		if _, ok := rooms[email]; !ok {
			c.JSON(400, nil)
			return
		}
		room := rooms[email]

		delete(rooms, email)
		close(waitForResponse[email])

		if _, ok := rooms[room.First.Email]; ok {
			waitForResponse[room.First.Email] <- Response{"Left", nil}
		}
		if _, ok := rooms[room.Second.Email]; ok {
			waitForResponse[room.Second.Email] <- Response{"Left", nil}
		}

		c.JSON(200, nil)
	}))

	app.GET("multiplayerTrivia/listenForEvents", CheckAuthToken(func(c *gin.Context, email string) {
		//HOLD REQUEST UNTIL SOME EVENT OCCURS ("Joined"/"Start"/"Answered"/"Next"/"Left")
		if _, ok := rooms[email]; !ok {
			c.JSON(400, nil)
			return
		}

		select{
			case response, ok := <- waitForResponse[email]:
				if !ok {
					//ONE OF PLAYERS LEFT, I.E. "Left" EVENT OCCURRED
					response = Response{"Left", nil}
					c.JSON(200, response)
				}else{
					//SOME OTHER EVENT OCCURED
					c.JSON(200, response)
				}
		}

	}))
}

func fetchNextQuestion(room Room, driver neo4j.Driver) Question {
	response, _ := queries.GetQuestionForTwo(driver, room.First.Email, room.Second.Email)

	return Question{response[0],
		response[1],
		response[2],
		response[3],
		response[4]}
}

/*
func startTimers(room Room){
	timers[room.First.Email] = time.AfterFunc(questionDuration, func(){
		waitForResponse[room.First.Email] <- Response{"Timeout", nil}
	})
	timers[room.Second.Email] = time.AfterFunc(questionDuration, func(){
		waitForResponse[room.Second.Email] <- Response{"Timeout", nil}
	})
}

func stopTimers(room Room){
	timers[room.First.Email].Stop()
	timers[room.Second.Email].Stop()
}
*/