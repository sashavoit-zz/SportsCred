package queries

import (
	"fmt"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	"time"
)

func AddNotif(driver neo4j.Driver, email string, title string, content string, notifType string)(interface{}, error){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		panic(err)
		return nil, err
	}
	defer session.Close()

	_, err = session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		_, err = transaction.Run(
			"MATCH(u:User {email: $email})\n"+
			"CREATE (n: Notification {type: $notifType, title: $title, content: $content})<-[:RECIPIENT_OF]-(u)\n",
			map[string]interface{}{"email": email, "title": title, "content": content, "notifType": notifType})
		if err != nil {
			panic(err)
			return nil, err
		}
		return nil, nil
	})

	return nil, err
}

func IfNewNotifs(driver neo4j.Driver, email string) bool {
	today:= time.Now().Format("2006-01-02")
	//today := "2020-07-30"

	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		panic(err)
		return false
	}
	defer session.Close()

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (u: User {email: $email})\n" +
				"MATCH (u)-[:RECIPIENT_OF]->(n: Notification)\n" +
				"WHERE NOT EXISTS(n.dateSeen)\n"+
				"WITH n\n" +
				"RETURN n",
			map[string]interface{}{"today": today, "email": email})
		if err != nil {
			panic(err)
			return nil, err
		}

		return result.Next(), nil
	})

	return fmt.Sprintf("%v", result) == "true"
}

func GetNotifs(driver neo4j.Driver, email string) (interface{}, error){
	today:= time.Now().Format("2006-01-02")
	//today := "2020-07-30"

	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		panic(err)
		return nil, err
	}
	defer session.Close()

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (u: User {email: $email})\n" +
				"MATCH (u)-[:RECIPIENT_OF]->(n: Notification)\n" +
				"WHERE NOT EXISTS(n.dateSeen) OR n.dateSeen = $today\n" +
				"SET n.dateSeen = $today\n" +
				"WITH n, ID(n) as notifId\n" +
				"RETURN COLLECT({id: notifId, title: n.title, content: n.content, type: n.type}) as notifs",
			map[string]interface{}{"today": today, "email": email})
		if err != nil {
			panic(err)
			return nil, err
		}
		if result.Next() {
			value, _ := result.Record().Get("notifs")
			return value, nil
		}
		return nil, nil
	})

	return result, err
}

func RemoveNotif(driver neo4j.Driver, id int) (interface{}, error){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		panic(err)
		return nil, err
	}
	defer session.Close()

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH(n: Notification)\n" +
				"WHERE ID(n) = $id\n" +
				"DETACH DELETE(n)",
			map[string]interface{}{"id": id})
		if err != nil {
			panic(err)
			return nil, err
		}
		if result.Next() {
			value, _ := result.Record().Get("notifs")
			return value, nil
		}
		return nil, nil
	})

	return result, err
}

