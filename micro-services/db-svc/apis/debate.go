package apis

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
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
			"MATCH (n:Question { id:$questionID }) return n.question",
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
			"MATCH (u:User),(q:Question) WHERE u.email = $email AND q.id = $questionID CREATE (u)-[a:ANSWER { answer:$answer }]->(q) RETURN a.answer",
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
			"MATCH (u:User { email:$email })-[ANSWER]->(:Question {id:$questionID}) RETURN ANSWER.answer, COALESCE(u.firstName,'') + ' ' + COALESCE(u.lastName,'') LIMIT 1",
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
			"MATCH (u: User)-[ANSWER]->(:Question {id:'fanalyst3'}) RETURN ANSWER.answer, COALESCE(u.firstName ,'') + ' ' + COALESCE(u.lastName ,''), u.email, rand() as r ORDER BY r LIMIT 3",
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
			"CREATE CONSTRAINT ON (n:Question) ASSERT n.id IS UNIQUE",
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
			"CREATE (n:Question { id:$questionID, question:$question }) return n",
			map[string]interface{}{"questionID": questionID, "question": question})
		if err != nil {
			return nil, err
		}
		return nil, result.Err()
	})

	return true, nil
}

func setUpQuestions() {
	var fanalystQuestions []string
	var analystQuestions []string
	var proanalystQuestions []string
	var expertanalystQuestions []string

	fanalystcontent, err := ioutil.ReadFile("../data/fanalystquestions.txt")
	if err == nil {
		fanalystQuestions = strings.Split(string(fanalystcontent), "\n")
	}

	for i, question := range fanalystQuestions {
		var fanalystID = "fanalyst" + strconv.Itoa(i)
		setUpQuestionsInDB(fanalystID, question)
	}

	analystcontent, err := ioutil.ReadFile("../data/analystquestions.txt")
	if err == nil {
		analystQuestions = strings.Split(string(analystcontent), "\n")
	}

	for i, question := range analystQuestions {
		var analystID = "analyst" + strconv.Itoa(i)
		setUpQuestionsInDB(analystID, question)
	}

	proanalystcontent, err := ioutil.ReadFile("../data/proanalystquestions.txt")
	if err == nil {
		proanalystQuestions = strings.Split(string(proanalystcontent), "\n")
	}

	for i, question := range proanalystQuestions {
		var proanalystID = "proanalyst" + strconv.Itoa(i)
		setUpQuestionsInDB(proanalystID, question)
	}

	expertanalystcontent, err := ioutil.ReadFile("../data/expertanalystquestions.txt")
	if err == nil {
		expertanalystQuestions = strings.Split(string(expertanalystcontent), "\n")
	}

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
			"MATCH  (u:User {email: $email}), (q:Question {id:$questionID}) RETURN EXISTS( (u)-[:ANSWER]-(q) )",
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

	fmt.Println(json.Email)
	fmt.Println(json.QuestionID)

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
}
