package queries

import (
	"fmt"
	"log"

	"github.com/neo4j/neo4j-go-driver/neo4j"
)

func UpdateProfile(driver neo4j.Driver, firstName string, lastName string, email string, phone string, about string) (string, error) {
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
	return fmt.Sprintf("%v", result), nil
}

func FollowUser(driver neo4j.Driver, user string, stranger string) (interface{}, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return false, err
	}
	defer session.Close()

	query := ""

	FollowExists, Ferr := CheckFriend(driver, user, stranger)
	if Ferr != nil {
		return FollowExists, Ferr
	} else if FollowExists == true {
		query = ("MATCH (u:User{email:$user})-[r:FOLLOWS]->(s:User{email:$stranger})\n" +
			"DELETE r")
	} else {
		query = ("MATCH (u:User{email:$user}), (s:User{email:$stranger}) \n" +
			"MERGE (u)-[r:FOLLOWS]->(s)")
	}
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(query,
			map[string]interface{}{"user": user, "stranger": stranger})

		if err != nil {

			return nil, err
		}
		if result.Next() {

			return result.Record().GetByIndex(0), nil
		}

		return nil, nil
	})
	return result, err
}

func CheckFriend(driver neo4j.Driver, user string, stranger string) (bool, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return false, err
	}
	defer session.Close()
	validation, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		// quering db
		result, err := transaction.Run("MATCH (u:User{email:$user})-[:FOLLOWS]->(s:User{email:$stranger}) RETURN count(u) > 0",
			map[string]interface{}{"user": user, "stranger": stranger})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}
		return nil, result.Err()
	})
	return validation == true, nil
}

func GetFriendsList(driver neo4j.Driver, email string) (interface{}, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return nil, err
	}
	defer session.Close()

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (u: User{email:$email})"+
				"-[:FOLLOWS]->(s:User)\n"+
				"RETURN collect({\n"+
				"birthday:s.birthday,"+
				"lastname:s.lastName,"+
				"firstname:s.firstName,"+
				"phone:s.phone,"+
				"email:s.email,"+
				"acs:s.acs,"+
				"about:s.about"+
				"})\n"+
				"as result",
			map[string]interface{}{"email": email})
		log.Println(result)
		//log.Println(result.Next())
		if err != nil {
			return nil, err
		}
		if result.Next() {
			value, _ := result.Record().Get("result")
			return value, nil
		} else {
			return nil, nil
		}

		return nil, result.Err()
	})

	return result, nil
}

func GetProfile(driver neo4j.Driver, email string) (interface{}, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return nil, err
	}
	defer session.Close()
	log.Println("bruh111")

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (u: User{email:$email})\n"+
				"RETURN collect({\n"+
				"birthday:u.birthday,"+
				"lastname:u.lastName,"+
				"firstname:u.firstName,"+
				"phone:u.phone,"+
				"email:u.email,"+
				"about:u.about,"+
				"acs:toString(u.acs),"+
				"debateAcs:toString(u.debateAcs),"+
				"triviaAcs:toString(u.triviaAcs)"+
				"})\n"+
				"as result",
			map[string]interface{}{"email": email})
		log.Println(result)
		//log.Println(result.Next())
		if err != nil {
			log.Println("err1")
			return nil, err
		}
		if result.Next() {
			log.Println("its fine")
			value, _ := result.Record().Get("result")
			return value, nil
		} else {
			log.Println("err2")
			return nil, nil
		}

		return nil, result.Err()
	})

	return result, nil
}

func GetUserByEmail(driver neo4j.Driver, email string) (interface{}, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return nil, err
	}
	defer session.Close()

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (u:User {email: $email}) RETURN u.firstName, u.lastName, u.about, u.phone, toString(u.acs)",
			map[string]interface{}{"email": email})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			record := result.Record()
			type User struct {
				FirstName string
				LastName  string
				About     string
				Phone     string
				Acs       string
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
				record.GetByIndex(4).(string),
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

func UpdateACS(driver neo4j.Driver, email string, addValue int, debate bool, trivia bool) (string, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	debateAcs, triviaAcs := 0, 0

	if debate {
		debateAcs = addValue
	}
	if trivia {
		triviaAcs = addValue
	}
	log.Println("-------------------9900")
	log.Println(debate)
	log.Println(trivia)
	log.Println(debateAcs)
	log.Println(triviaAcs)
	log.Println(email)
	log.Println(addValue)
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run("MATCH (u:User {email:$email}) SET u.triviaAcs = u.triviaAcs + toInteger($triviaAcs), u.debateAcs = u.debateAcs + toInteger($debateAcs), u.acs = CASE WHEN u.acs + toInteger($addValue) > 100 THEN u.acs + toInteger($addValue) ELSE 100 END ,u.acsHistory = u.acsHistory + [toString(toInteger(head(split(last(u.acsHistory),'@'))) + toInteger($addValue)) + '@' + timestamp()];",
			map[string]interface{}{"email": email, "addValue": addValue, "triviaAcs": triviaAcs, "debateAcs": debateAcs})
		if err != nil {

			return nil, err
		}
		if result.Err() != nil {
			log.Println(result.Err())
		}
		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}
		return nil, result.Err()
	})
	return fmt.Sprintf("%v", result), nil
}

func GetUserAcsByEmail(driver neo4j.Driver, email string) (interface{}, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return nil, err
	}
	defer session.Close()
	//"MATCH (u:User {email: $email}) RETURN toInteger(head(split(last(u.acsHistory),'@')))"
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (u:User {email: $email}) RETURN toInteger(u.acs)",
			map[string]interface{}{"email": email})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			record := result.Record()
			log.Println("-------------------9900")
			log.Println(record.GetByIndex(0))

			return record.GetByIndex(0), nil
		}
		return nil, result.Err()
	})

	return result, nil
}

func GetAcsHistoryByEmail(driver neo4j.Driver, email string) (interface{}, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run("MATCH (u:User {email:$email}) RETURN u.acsHistory;",
			map[string]interface{}{"email": email})
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

func UploadProfilePic(driver neo4j.Driver, email string, link string) (interface{}, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return nil, err
	}
	defer session.Close()

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH(u: User{email:$email}) \n"+
				"SET u += {profilePic:$link}\n"+
				"RETURN {link:u.profilePic} as link",
			map[string]interface{}{"email": email, "link": link})
		if err != nil {
			return nil, err
		}

		if result.Next() {
			value, _ := result.Record().Get("link")
			return value, nil
		} else {
			return nil, nil
		}
	})

	return result, nil
}

func GetUserProfilePic(driver neo4j.Driver, email string) (interface{}, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return nil, err
	}
	defer session.Close()

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH(u: User{email:$email}) \n"+
				"RETURN {link:u.profilePic} as link",
			map[string]interface{}{"email": email})
		if err != nil {
			return nil, err
		}

		if result.Next() {
			value, _ := result.Record().Get("link")
			return value, nil
		} else {
			return nil, nil
		}
	})

	return result, nil
}
