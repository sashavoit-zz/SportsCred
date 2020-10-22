package queries

import (
	"github.com/neo4j/neo4j-go-driver/neo4j"
)

func QueryUsers(driver neo4j.Driver, name string, skip int, pagesize int)(interface{}, error){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.ReadTransaction(func(transaction neo4j.Transaction) (interface{}, error){
		result, err := transaction.Run(
		"MATCH (n) \n"+
		"WHERE n.username STARTS WITH $username \n"+
		"WITH n \n"+
		"ORDER BY n.id \n"+
		"SKIP $skip LIMIT $pagesize \n"+
		"WITH COLLECT({id:n.id,avatar:n.avatar,username:n.username,status:n.status}) AS result \n"+
		"RETURN result",
		map[string]interface{}{"username":name,"skip":skip,"pagesize":pagesize})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			value, _ := result.Record().Get("result")
			return value, nil
		}else{
			return nil, nil
		}

		return nil, result.Err()
	})
	return result, nil
}