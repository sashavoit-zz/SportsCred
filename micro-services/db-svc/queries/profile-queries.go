package queries

import (
	"fmt"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	// "log"
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

func GetUserByEmail(driver neo4j.Driver, email string)(interface{}, error){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return nil, err
	}
	defer session.Close()

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error){
		result, err := transaction.Run(
			"MATCH (u:User {email: $email}) RETURN u.firstName, u.lastName",
			map[string]interface{}{"email":email})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			record := result.Record()
			
			firstName:= record.GetByIndex(0).(string)
			lastName:= record.GetByIndex(1).(string)
			return lastName + " " +firstName, nil
		}
		return nil, result.Err()
	})

	return result, nil
}