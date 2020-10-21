package queries

import (
	"fmt"
	"github.com/neo4j/neo4j-go-driver/neo4j"
)

func UpdateProfile(driver neo4j.Driver, firstName string, lastName string, email string, phone string, about string)(string, error){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (u:User {email:$email}) SET u += {firstName:$firstName, lastName:$lastName, about:$about, phone:$phone}",
			map[string]interface{}{"firstName": firstName, "lastName": lastName, "email": email, "about": about, "phone": phone})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}
		return nil, result.Err()
	})
	return fmt.Sprintf("%v",result), nil
}