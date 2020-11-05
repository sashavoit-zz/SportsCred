package queries

import (
	"fmt"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	"log"
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
			"MATCH (u:User {email: $email}) RETURN u.firstName, u.lastName, u.about, u.phone",
			map[string]interface{}{"email":email})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			record := result.Record()
			type User struct{
				FirstName string
				LastName string
				About string
				Phone string
			}
			// firstName:= "firsN"
			// lastName := "lastN"
			//node, _ := result.Record().Get("result")
			// username, ok := record.Get("username")
			user := User{
				record.GetByIndex(0).(string),
				record.GetByIndex(1).(string),
				record.GetByIndex(2).(string),
				record.GetByIndex(3).(string),
			}

			log.Println("-------------------9900")
			log.Println(user)

			// log.Println("-------------------99011")
			// fmt.Printf("%+v\n",user)

			// result,err = json.Marshal(user)
			// log.Println("-------------------88881")
			// log.Println(result)

			// log.Println(lastName)
			// log.Println(about)
			// log.Println(phone)
			// log.Println("333---")
			
			// log.Println(profile.Email)
			// log.Println(profile.Phone)
			// log.Println(profile.About)
			return user, nil
		}
		return nil, result.Err()
	})

	return result, nil
}