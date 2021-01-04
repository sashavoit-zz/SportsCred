package queries

import (
	"github.com/neo4j/neo4j-go-driver/neo4j"
)

func GetQuestionForTwo(driver neo4j.Driver, firstPlayer string, secondPlayer string) ([6]string, error){
	var responseBody [6]string

	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return responseBody, err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (:User {email:$firstPlayer})-[:NOT_ANSWERED]-(n:Question)-[:NOT_ANSWERED]-(:User {email:$secondPlayer})\n"+
				"RETURN n.question, n.option1, n.option2, n.option3, n.answer\n"+
				"LIMIT 1", // or MERGE
			map[string]interface{}{"firstPlayer": firstPlayer, "secondPlayer": secondPlayer})
		if err != nil {
			return nil, err
		}
		if result.Next() {

			responseBody[0] = result.Record().GetByIndex(0).(string)
			responseBody[1] = result.Record().GetByIndex(1).(string)
			responseBody[2] = result.Record().GetByIndex(2).(string)
			responseBody[3] = result.Record().GetByIndex(3).(string)
			responseBody[4] = result.Record().GetByIndex(4).(string)

			return result.Record().GetByIndex(0), nil
		}
		return nil, result.Err()
	})

	resulter := result.(string)
	responseBody[5] = resulter

	return responseBody, nil
}