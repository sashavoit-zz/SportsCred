package queries

import (
	"github.com/neo4j/neo4j-go-driver/neo4j"
)

func LoadDebateAnswers(driver neo4j.Driver, email string) (interface{}, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return nil, err
	}
	defer session.Close()

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"CALL{\n"+
				"MATCH (a:DebateAnswer {email:$email})\n"+
				"MATCH (n:Debate {id: a.questionID})\n"+
				"RETURN a, n.question as question\n"+
				"}\n"+

				"RETURN collect({"+
				"answer: a.answer,"+
				"question: question"+
				"})\n"+
				"as debateAnswer",
			map[string]interface{}{"email": email})
		if err != nil {
			return nil, err
		}

		if result.Next() {
			value, _ := result.Record().Get("debateAnswer")
			return value, nil
		} else {
			return nil, nil
		}
	})

	return result, nil
}
