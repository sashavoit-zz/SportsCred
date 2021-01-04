package queries

import (
	"strconv"

	"github.com/neo4j/neo4j-go-driver/neo4j"
)

func GetGlobalLeaderboard(driver neo4j.Driver) ([500]string, error) {
	var responseBody [500]string
	var i = 0

	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return responseBody, err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (n)\n"+"WHERE n.acs >= 100 AND n.acs <=1100\n"+"RETURN COALESCE(n.firstName, \"\") + ' ' + COALESCE(n.lastName, \"\"), n.acs", // or MERGE
			map[string]interface{}{})
		if err != nil {
			return nil, err
		}

		for result.Next() {

			responseBody[i] = result.Record().GetByIndex(0).(string)
			i++
			//log.Println(result.Record().GetByIndex(0).(string))
			responseBody[i] = strconv.FormatInt(result.Record().GetByIndex(1).(int64), 10)
			i++
			//log.Println(strconv.FormatInt(result.Record().GetByIndex(1).(int64), 10))

		}
		return nil, result.Err()
	})

	resulter := result
	resulter = "hi"
	responseBody[499] = resulter.(string)
	//responseBody[0] = "hello"

	return responseBody, nil
}

func GetFanalystLeaderboard(driver neo4j.Driver) ([500]string, error) {
	var responseBody [500]string
	var i = 0

	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return responseBody, err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (n)\n"+"WHERE n.acs >= 100 AND n.acs <=300\n"+"RETURN COALESCE(n.firstName, \"\") + ' ' + COALESCE(n.lastName, \"\"), n.acs", // or MERGE
			map[string]interface{}{})
		if err != nil {
			return nil, err
		}

		for result.Next() {

			responseBody[i] = result.Record().GetByIndex(0).(string)
			i++
			//log.Println(result.Record().GetByIndex(0).(string))
			responseBody[i] = strconv.FormatInt(result.Record().GetByIndex(1).(int64), 10)
			i++
			//log.Println(strconv.FormatInt(result.Record().GetByIndex(1).(int64), 10))

		}
		return nil, result.Err()
	})

	resulter := result
	resulter = "hi"
	responseBody[499] = resulter.(string)
	//responseBody[0] = "hello"

	return responseBody, nil
}

func GetAnalystLeaderboard(driver neo4j.Driver) ([500]string, error) {
	var responseBody [500]string
	var i = 0

	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return responseBody, err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (n)\n"+"WHERE n.acs >= 300 AND n.acs <=600\n"+"RETURN COALESCE(n.firstName, \"\") + ' ' + COALESCE(n.lastName, \"\"), n.acs", // or MERGE
			map[string]interface{}{})
		if err != nil {
			return nil, err
		}

		for result.Next() {

			responseBody[i] = result.Record().GetByIndex(0).(string)
			i++
			//log.Println(result.Record().GetByIndex(0).(string))
			responseBody[i] = strconv.FormatInt(result.Record().GetByIndex(1).(int64), 10)
			i++
			//log.Println(strconv.FormatInt(result.Record().GetByIndex(1).(int64), 10))

		}
		return nil, result.Err()
	})

	resulter := result
	resulter = "hi"
	responseBody[499] = resulter.(string)
	//responseBody[0] = "hello"

	return responseBody, nil
}

func GetProAnalystLeaderboard(driver neo4j.Driver) ([500]string, error) {
	var responseBody [500]string
	var i = 0

	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return responseBody, err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (n)\n"+"WHERE n.acs >= 600 AND n.acs <=900\n"+"RETURN COALESCE(n.firstName, \"\") + ' ' + COALESCE(n.lastName, \"\"), n.acs", // or MERGE
			map[string]interface{}{})
		if err != nil {
			return nil, err
		}

		for result.Next() {

			responseBody[i] = result.Record().GetByIndex(0).(string)
			i++
			//log.Println(result.Record().GetByIndex(0).(string))
			responseBody[i] = strconv.FormatInt(result.Record().GetByIndex(1).(int64), 10)
			i++
			//log.Println(strconv.FormatInt(result.Record().GetByIndex(1).(int64), 10))

		}
		return nil, result.Err()
	})

	resulter := result
	resulter = "hi"
	responseBody[499] = resulter.(string)
	//responseBody[0] = "hello"

	return responseBody, nil
}

func GetExpertAnalystLeaderboard(driver neo4j.Driver) ([500]string, error) {
	var responseBody [500]string
	var i = 0

	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return responseBody, err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (n)\n"+"WHERE n.acs >= 900 AND n.acs <=1100\n"+"RETURN COALESCE(n.firstName, \"\") + ' ' + COALESCE(n.lastName, \"\"), n.acs", // or MERGE
			map[string]interface{}{})
		if err != nil {
			return nil, err
		}

		for result.Next() {

			responseBody[i] = result.Record().GetByIndex(0).(string)
			i++
			//log.Println(result.Record().GetByIndex(0).(string))
			responseBody[i] = strconv.FormatInt(result.Record().GetByIndex(1).(int64), 10)
			i++
			//log.Println(strconv.FormatInt(result.Record().GetByIndex(1).(int64), 10))

		}
		return nil, result.Err()
	})

	resulter := result
	resulter = "hi"
	responseBody[499] = resulter.(string)
	//responseBody[0] = "hello"

	return responseBody, nil
}
