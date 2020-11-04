package queries

import (
	"fmt"
	"log"
	"github.com/neo4j/neo4j-go-driver/neo4j"
)

func LoadAllPosts(driver neo4j.Driver) (interface{}, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return nil, err
	}
	defer session.Close()

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH(p: Post) \n"+
				"CALL { \n"+
				"WITH p \n"+
				"MATCH(u:User {email: p.email}) \n"+
				"RETURN u.firstName as userFirstName, u.lastName as userLastName \n"+
				"} \n"+
				"RETURN collect({firstName: userFirstName, lastName: userLastName, userProfile: p.userProfile, postId: toString(p.postId), content: p.content, time: p.time, likes: toString(p.likes), dislikes: toString(p.dislikes)}) as posts",
			map[string]interface{}{})
		if err != nil {
			return nil, err
		}

		if result.Next() {
			value, _ := result.Record().Get("posts")
			return value, nil
		} else {
			return nil, nil
		}
	})

	return result, nil
}

func LoadPost(driver neo4j.Driver, postId string) (interface{}, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return nil, err
	}
	defer session.Close()
	log.Println("0102000")
	log.Println(postId)
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (p:Post {postId: toInteger($postId)}) RETURN p.content, toString(p.dislikes), toString(p.likes)",
			map[string]interface{}{"postId":postId})
		log.Println(err)
		if err != nil {
			return nil, err
		}
	
		if result.Next() {
			record := result.Record()
			// log.Println("0102001")
			// log.Println(result)
			// log.Println(result.Record())
			// log.Println(result.Record().GetByIndex(0).(string))
			type Post struct{
				Content string
				Dislikes string
				Likes string
			}
			post := Post{
				record.GetByIndex(0).(string),
				record.GetByIndex(1).(string),
				record.GetByIndex(2).(string),
			}
			log.Println("010000")
			log.Println(post)
			return post, nil
		} else {
			return nil, nil
		}
	})

	return result, nil
}

// add post in the database
func AddPost(driver neo4j.Driver, content string, email string, likes int, dislikes int, postTime string) (string, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"CREATE (n:Post {content:$content, email:$email, likes:$likes, dislikes:$dislikes, postTime:$postTime})\n"+
				"SET n.postId = id(n)\n"+
				"WITH n \n"+
				"MATCH(u:User{email:$email})\n"+
				"MERGE (u)-[r:CREATED]->(n)", // or MERGE
			map[string]interface{}{"content": content, "email": email, "likes": likes, "dislikes": dislikes, "postTime": postTime})
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

func GetUserNameByEmail(driver neo4j.Driver, email string) (interface{}, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return nil, err
	}
	defer session.Close()

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH(u: User{email:$email}) \n"+
				"RETURN {firstName: u.firstName, lastName: u.lastName} as userName",
			map[string]interface{}{"email": email})
		if err != nil {
			return nil, err
		}

		if result.Next() {
			value, _ := result.Record().Get("userName")
			return value, nil
		} else {
			return nil, nil
		}
	})

	return result, nil
}
