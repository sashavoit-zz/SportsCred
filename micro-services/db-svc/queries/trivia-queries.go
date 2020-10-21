package queries

import (
	"fmt"
	"github.com/neo4j/neo4j-go-driver/neo4j"
)

func AddQuestion(driver neo4j.Driver, question string, option1 string, option2 string, option3 string, answer string) (string, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"CREATE (n:Question {question:$question, option1:$option1, option2:$option2, option3:$option3, answer:$answer})", // or MERGE
			map[string]interface{}{"question": question, "option1": option1, "option2": option2, "option3": option3, "answer": answer})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}
		return nil, result.Err()
	})
	return fmt.Sprintf("%v", result), nil
}

func AddQuestionRelationship(driver neo4j.Driver, question string, user string) (string, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (a:Question {question:$question}),(t:User {name:$user})\n"+"MERGE (t)-[r:NOT_ANSWERED]->(a)\n"+"RETURN r", // or MERGE
			map[string]interface{}{"question": question, "user": user})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}
		return nil, result.Err()
	})
	return fmt.Sprintf("%v", result), nil
}

func GetQuestion(driver neo4j.Driver, user string) ([6]string, error) {
	var responseBody [6]string

	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return responseBody, err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (n:Question)-[r:NOT_ANSWERED]-(t:User {name:$user})\n"+"RETURN n.question, n.option1, n.option2, n.option3, n.answer\n"+"LIMIT 1", // or MERGE
			map[string]interface{}{"user": user})
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

func DeleteQuestionRelationship(driver neo4j.Driver, question string, user string) (string, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (a:Question {question:$question})-[r:NOT_ANSWERED]-(t:User {name:$user})\n"+"DELETE r", // or MERGE
			map[string]interface{}{"question": question, "user": user})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}
		return nil, result.Err()
	})
	return fmt.Sprintf("%v", result), nil
}
