package apis

import (
	"db-svc/queries"
	"fmt"
	"math"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	"github.com/robfig/cron/v3"
)

var neo4jDriver2 neo4j.Driver // used in all db related funcs

func getQuestionWithID(questionID string) (string, error) {

	// session set up
	session, err := neo4jDriver2.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()

	validation, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		// quering db
		result, err := transaction.Run(
			"MATCH (n:Debate { id:$questionID }) return n.question",
			map[string]interface{}{"questionID": questionID})
		if err != nil {
			return nil, err
		}

		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}

		return nil, result.Err()
	})
	if validation != nil {
		return validation.(string), nil
	}

	return "", nil
}

func postAnswerToDB(email string, questionID string, answer string) (string, error) {

	// session set up
	session, err := neo4jDriver2.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()

	validation, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		// quering db
		result, err := transaction.Run(
			"MATCH (u:User {email:$email}), (d:Debate {id:$questionID}) CREATE (n:DebateAnswer {email:$email, questionID:$questionID, answer:$answer}) CREATE (n)-[q:DEBATEQUESTION]->(d) CREATE (n)-[p:POSTEDBY]->(u) return n.answer",
			map[string]interface{}{"email": email, "questionID": questionID, "answer": answer})
		if err != nil {
			return nil, err
		}

		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}

		return nil, result.Err()
	})
	if validation != nil {
		return validation.(string), nil
	}
	return "", nil
}

func postAnswer(c *gin.Context) {

	type Answer struct {
		Email      string
		QuestionID string
		Answer     string
	}
	var json Answer

	// check json and populate it if its iight
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	answer, err := postAnswerToDB(json.Email, json.QuestionID, json.Answer)

	// everything worked!
	if answer == "" {
		c.JSON(http.StatusNotImplemented, gin.H{"answer": answer})
	} else if err == nil {
		c.JSON(http.StatusOK, gin.H{"answer": answer})
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

func getQuestion(c *gin.Context) {

	type QuestionID struct {
		QuestionID string
	}
	var json QuestionID

	// check json and populate it if its iight
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	question, err := getQuestionWithID(json.QuestionID)

	// everything worked!
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"question": question})
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

func addRatingToDB(questionID string, posterEmail string, raterEmail string, rating int) (int64, error) {

	// session set up
	session, err := neo4jDriver2.Session(neo4j.AccessModeWrite)
	if err != nil {
		return 0, err
	}
	defer session.Close()

	validation, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		// quering db
		result, err := transaction.Run(
			"MATCH (da: DebateAnswer {questionID:$questionID, email:$posterEmail}), (rater: User {email:$raterEmail}) MERGE (da)-[r: RATEDBY]->(rater) SET r.rating=$rating RETURN r.rating",
			map[string]interface{}{"questionID": questionID, "posterEmail": posterEmail, "raterEmail": raterEmail, "rating": rating})
		if err != nil {
			return nil, err
		}

		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}

		return nil, result.Err()
	})
	if validation != nil {
		return validation.(int64), nil
	}

	return 0, nil
}

func addRating(c *gin.Context) {

	type QuestionID struct {
		QuestionID  string
		PosterEmail string
		RaterEmail  string
		Rating      int
	}
	var json QuestionID

	// check json and populate it if its iight
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	addRatingToDB(json.QuestionID, json.PosterEmail, json.RaterEmail, json.Rating)
	rating, err := getRatingFromDB(json.QuestionID, json.PosterEmail)

	// everything worked!
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"rating": rating})
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

func getRatingFromDB(questionID string, posterEmail string) (float64, error) {

	// session set up
	session, err := neo4jDriver2.Session(neo4j.AccessModeWrite)
	if err != nil {
		return 0.0, err
	}
	defer session.Close()

	validation, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		// quering db
		result, err := transaction.Run(
			"MATCH (da: DebateAnswer {questionID:$questionID, email:$posterEmail})-[r:RATEDBY]->(:User) RETURN avg(r.rating)",
			map[string]interface{}{"questionID": questionID, "posterEmail": posterEmail})
		if err != nil {
			return nil, err
		}

		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}

		return nil, result.Err()
	})
	if validation != nil {
		return validation.(float64), nil
	}

	return 0.0, nil
}

func getRating(c *gin.Context) {

	type QuestionID struct {
		QuestionID  string
		PosterEmail string
	}
	var json QuestionID

	// check json and populate it if its iight
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rating, err := getRatingFromDB(json.QuestionID, json.PosterEmail)

	// everything worked!
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"rating": rating})
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

func getUsersRatingFromDB(questionID string, posterEmail string, raterEmail string) (int64, error) {

	// session set up
	session, err := neo4jDriver2.Session(neo4j.AccessModeWrite)
	if err != nil {
		return 0, err
	}
	defer session.Close()

	validation, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		// quering db
		result, err := transaction.Run(
			"MATCH (da: DebateAnswer {questionID:$questionID, email:$posterEmail})-[r:RATEDBY]->(:User {email:$raterEmail}) RETURN r.rating LIMIT 1",
			map[string]interface{}{"questionID": questionID, "posterEmail": posterEmail, "raterEmail": raterEmail})
		if err != nil {
			return nil, err
		}

		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}

		return nil, result.Err()
	})
	if validation != nil {
		return validation.(int64), nil
	}

	return 0, nil
}

func getUsersRating(c *gin.Context) {

	type QuestionID struct {
		QuestionID  string
		PosterEmail string
		RaterEmail  string
	}
	var json QuestionID

	// check json and populate it if its iight
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rating, err := getUsersRatingFromDB(json.QuestionID, json.PosterEmail, json.RaterEmail)

	// everything worked!
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"rating": rating})
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

func getUserAnswer(email string, questionID string) ([2]string, error) {
	var answer [2]string

	// session set up
	session, err := neo4jDriver2.Session(neo4j.AccessModeWrite)
	if err != nil {
		return answer, err
	}
	defer session.Close()

	validation, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		// quering db
		result, err := transaction.Run(
			"MATCH (u: User {email:$email}), (d:DebateAnswer {email:$email, questionID:$questionID}) RETURN d.answer, COALESCE(u.firstName,'') + ' ' + COALESCE(u.lastName,'') LIMIT 1",
			map[string]interface{}{"email": email, "questionID": questionID})
		if err != nil {
			return nil, err
		}

		if result.Next() {
			var userAnswer = result.Record().GetByIndex(0)
			if w, ok := userAnswer.(string); ok {
				answer[0] = w
			}
			var userName = result.Record().GetByIndex(1)
			if w, ok := userName.(string); ok {
				answer[1] = w
			}

			return answer, nil
		}

		return nil, result.Err()
	})
	if validation != nil {
		return validation.([2]string), nil
	}

	return answer, nil
}

func getAnswer(c *gin.Context) {

	type Answer struct {
		Email      string
		QuestionID string
	}
	var json Answer

	// check json and populate it if its iight
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	answer, err := getUserAnswer(json.Email, json.QuestionID)

	// everything worked!
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"answer": answer[0], "name": answer[1]})
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

func getRandomUserAnswers(questionID string) ([9]string, error) {
	var answers [9]string

	// session set up
	session, err := neo4jDriver2.Session(neo4j.AccessModeWrite)
	if err != nil {
		return answers, err
	}
	defer session.Close()

	validation, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		// quering db
		result, err := transaction.Run(
			"MATCH (b: DebateAnswer {questionID:$questionID})-[:POSTEDBY]->(u: User) RETURN b.answer, COALESCE(u.firstName ,'') + ' ' + COALESCE(u.lastName ,''), u.email, rand() as r ORDER BY r LIMIT 3",
			map[string]interface{}{"questionID": questionID})
		if err != nil {
			return nil, err
		}

		i := 0
		for result.Next() {
			if i < 3 {
				for j := 0; j < 3; j++ {
					var answer = result.Record().GetByIndex(j)
					if w, ok := answer.(string); ok {
						answers[3*i+j] = w
					}
				}
				i++
			}
		}

		return answers, result.Err()
	})
	if validation != nil {
		return validation.([9]string), nil
	}

	return answers, nil
}

func updateACS(questionID string) error {

	// session set up
	session, err := neo4jDriver2.Session(neo4j.AccessModeWrite)
	if err != nil {
		return err
	}
	defer session.Close()

	validation, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		// quering db
		result, err := transaction.Run(
			"MATCH (author:User)<-[:POSTEDBY]-(da: DebateAnswer {questionID:$questionID})-[r:RATEDBY]->(u:User) RETURN author.email, avg(r.rating) ORDER BY avg(r.rating) desc",
			map[string]interface{}{"questionID": questionID})
		if err != nil {
			return nil, err
		}

		i := 0
		for result.Next() {
			var email = result.Record().GetByIndex(0)
			var rating = result.Record().GetByIndex(1)

			message := fmt.Sprint("Congratulations for getting a debate rating of ", math.Round(rating.(float64)), " yesterday. You are being awarded ", (math.Floor(rating.(float64)/10) + 1), " ACS points")
			queries.UpdateACS(neo4jDriver2, email.(string), int((math.Floor(rating.(float64)/10) + 1)), true, false)
			SendNotif(email.(string), "Debate ACS", message, "info")

			if i == 0 {
				leaderMessage := fmt.Sprint("Congratulations for getting the highest debate rating of ", math.Round(rating.(float64)), " yesterday in your group. You are being awarded an additional 5 ACS points.")
				queries.UpdateACS(neo4jDriver2, email.(string), 5, true, false)
				SendNotif(email.(string), "Debate ACS", leaderMessage, "info")
				i++
			}
		}

		return nil, result.Err()
	})
	if validation != nil {
		return nil
	}

	return nil
}

func getAnswers(c *gin.Context) {

	type Answer struct {
		QuestionID string
	}
	var json Answer

	// check json and populate it if its iight
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	answers, err := getRandomUserAnswers(json.QuestionID)

	// everything worked!
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"answer0": answers[0], "name0": answers[1], "email0": answers[2], "answer1": answers[3], "name1": answers[4], "email1": answers[5], "answer2": answers[6], "name2": answers[7], "email2": answers[8]})
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

func setQuestionDBConstraint() (bool, error) {
	session, err := neo4jDriver2.Session(neo4j.AccessModeWrite)
	if err != nil {
		return false, err
	}
	defer session.Close()

	session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"CREATE CONSTRAINT ON (n:Debate) ASSERT n.id IS UNIQUE",
			map[string]interface{}{"message": "hello, world"})
		if err != nil {
			return nil, err
		}

		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}

		return nil, result.Err()
	})

	return true, nil
}

func setUpQuestionsInDB(questionID string, question string) (bool, error) {
	// session set up
	session, err := neo4jDriver2.Session(neo4j.AccessModeWrite)
	if err != nil {
		return false, err
	}
	defer session.Close()

	session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		// quering db
		result, err := transaction.Run(
			"CREATE (n:Debate { id:$questionID, question:$question }) return n",
			map[string]interface{}{"questionID": questionID, "question": question})
		if err != nil {
			return nil, err
		}
		return nil, result.Err()
	})

	return true, nil
}

func setUpQuestions() {

	fanalystQuestions := []string{"Who is the greatest of all time?",
		"Is Dwight Howard a HOF’er",
		"What should be the criteria for the HOF? Rings or accolades?",
		"Is Carmelo Anthony a HOF’er?",
		"Does Ja Morant win ROY if Zion plays a full season based on the numbers he put up in the games before and after the bubble?",
		"Should college basketball players be paid?",
		"Best team ever?",
		"Who would you rather build around? Giannis Antetokounmpo or Ben Simmons?",
		"Kyle Lowry or Russell Westbrook?",
		"Should WNBA players be paid more?"}

	for i, question := range fanalystQuestions {
		var fanalystID = "fanalyst" + strconv.Itoa(i)
		setUpQuestionsInDB(fanalystID, question)
	}

	analystQuestions := []string{"Who is the greatest of all time?",
		"In the modern era 1990-2020 who is the best coach? Phil Jackson or Gregg Popovich",
		"Who’s A Better Point Guard: Kyrie, Steph, Westbrook or CP3?",
		"Who was the real MVP Shaq or Kobe",
		"What should be the criteria for the HOF? Rings or accolades?",
		"Did Kobe Bryant deserve MVP in 2006-07 over Dirk?",
		"Should college basketball players be paid?",
		"Who was better of these two: Magic or Bird?",
		"Is Chris Paul over or underrated?",
		"Should WNBA players be paid more?"}

	for i, question := range analystQuestions {
		var analystID = "analyst" + strconv.Itoa(i)
		setUpQuestionsInDB(analystID, question)
	}

	proanalystQuestions := []string{"Who is the greatest of all time?",
		"Who’s A Better Point Guard: Kyrie, Steph, Westbrook or CP3?",
		"What should be the criteria for the HOF? Rings or accolades?",
		"Did Kobe Bryant deserve MVP in 2006-07 over Dirk?",
		"Who is the best Centre to ever play basketball?",
		"Should college basketball players be paid?",
		"Who was better of these two: Magic or Bird?",
		"Most underrated player ever?",
		"Most overrated player ever?",
		"Are Lebron’s teammates really that bad or are they never credited?"}

	for i, question := range proanalystQuestions {
		var proanalystID = "proanalyst" + strconv.Itoa(i)
		setUpQuestionsInDB(proanalystID, question)
	}

	expertanalystQuestions := []string{"Who is the greatest of all time?",
		"Who’s A Better Point Guard: Kyrie, Steph, Westbrook or CP3?",
		"Which brand of basketball was better 1990-2005 or 2005-2020?",
		"Is Carmelo Anthony a HOF’er?",
		"Who was the real MVP Shaq or Kobe?",
		"What should be the criteria for the HOF? Rings or accolades?",
		"Who is the best Centre to ever play basketball?",
		"Should college basketball players be paid?",
		"Who was better of these two: Magic or Bird?",
		"Most underrated player ever?"}

	for i, question := range expertanalystQuestions {
		var expertanalystID = "expertanalyst" + strconv.Itoa(i)
		setUpQuestionsInDB(expertanalystID, question)
	}

}

func checkAnswerExists(email string, questionID string) (bool, error) {
	// session set up
	session, err := neo4jDriver1.Session(neo4j.AccessModeWrite)
	if err != nil {
		return false, err
	}
	defer session.Close()

	validation, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		// quering db
		result, err := transaction.Run(
			"MATCH (d:DebateAnswer {email:$email, questionID:$questionID}) RETURN d is not null",
			map[string]interface{}{"email": email, "questionID": questionID})
		if err != nil {
			return nil, err
		}

		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}

		return nil, result.Err()
	})

	if validation != nil {
		res := validation.(bool)
		return res, nil
	}

	return false, nil
}

func checkAnswer(c *gin.Context) {

	type Answer struct {
		Email      string
		QuestionID string
	}
	var json Answer

	// check json and populate it if its iight
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// verify user in DB
	if result, err := checkAnswerExists(json.Email, json.QuestionID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}) // db error
		return
	} else if result {
		c.JSON(http.StatusNotAcceptable, gin.H{"status": "answer already exists"}) // user or pass dont match
		return
	}

	// everything worked!
	c.JSON(http.StatusOK, gin.H{"status": "can answer"})
}

// SetUpDebate  sets up debate
func SetUpDebate(server *gin.Engine, driver neo4j.Driver) {
	// -------soso: this is for profile page
	server.GET("/allDebateAnswer/:email", CheckAuthToken(func(c *gin.Context, _ string) {
		email := c.Param("email")
		result, err := queries.LoadDebateAnswers(driver, email)
		if err != nil {
			c.String(500, "Internal server error")
			return
		} else if result == nil {
			c.String(404, "Not found")
			return
		}
		c.JSON(200, result)
	}))
	// -------sosoend

	neo4jDriver2 = driver

	//fmt.Println("here1")

	setQuestionDBConstraint()
	setUpQuestions()

	// endpoints
	server.POST("/question", getQuestion)
	server.POST("/answer", postAnswer)
	server.POST("/answerExists", checkAnswer)
	server.POST("/getAnswer", getAnswer)
	server.POST("/getAnswers", getAnswers)
	server.POST("/getRating", getRating)
	server.POST("/addRating", addRating)
	server.POST("/getUsersRating", getUsersRating)

	c := cron.New()
	// Job runs every day at 12am
	//c.AddFunc("19 17 * * *", func() {
	c.AddFunc("0 0 * * *", func() {
		currentTime := time.Now()
		day := currentTime.Day() - 1
		//day := currentTime.Day()
		dayString := strconv.Itoa(day)
		endDigitString := dayString[len(dayString)-1:]
		updateACS("fanalyst" + endDigitString)
		updateACS("analyst" + endDigitString)
		updateACS("proanalyst" + endDigitString)
		updateACS("expertanalyst" + endDigitString)
	})
	c.Start()
}
