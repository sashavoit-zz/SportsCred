package apis

import (
	"io/ioutil"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
)

var neo4jDriver2 neo4j.Driver // used in all db related funcs

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

// SetUpDebate  sets up debate
func SetUpDebate(server *gin.Engine, driver neo4j.Driver) {
	neo4jDriver2 = driver

	//fmt.Println("here1")

	setQuestionDBConstraint()
	setUpQuestions()
	// endpoints
}
