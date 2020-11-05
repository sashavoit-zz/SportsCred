package queries

import (
	"fmt"
	"strconv"
	//"log"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	"strings"
    "syscall"
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

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH(p: Post {postId: toInteger($postId)}) \n"+
				"CALL { \n"+
				"WITH p \n"+
				"MATCH(u:User {email: p.email}) \n"+
				"RETURN u.firstName as userFirstName, u.lastName as userLastName \n"+
				"} \n"+
				"RETURN collect({firstName: userFirstName, lastName: userLastName, userProfile: p.userProfile, postId: toString(p.postId), content: p.content, time: p.time, likes: toString(p.likes), dislikes: toString(p.dislikes)}) as posts",
			map[string]interface{}{"postId":postId})
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
func VisitorLoadPost(driver neo4j.Driver, postId string) (interface{}, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return nil, err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (p:Post {postId: toInteger($postId)}) RETURN p.content, toString(p.dislikes), toString(p.likes)",
			map[string]interface{}{"postId":postId})
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



func AddReply(driver neo4j.Driver, content string, email string, likes int, dislikes int, commentTime string, postid string) (string, error) {
	id, err := strconv.Atoi(postid);
	if err != nil {
		return "", err
	}
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"CREATE (n:Comment {content:$content, email:$email, likes:$likes, dislikes:$dislikes, commentTime:$commentTime})\n"+
				"SET n.commentId = id(n)\n"+
				"WITH n \n"+
				"MATCH(p:Post)\n"+
				"WHERE id(p)=$postid\n"+
				"MERGE (n)-[r:REPLY]->(p)", // or MERGE
			map[string]interface{}{"content": content, "email": email, "likes": likes, "dislikes": dislikes, "commentTime": commentTime,"postid":id})
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

func LoadPostReply(driver neo4j.Driver, postid string) (interface{}, error) {
	id, err := strconv.Atoi(postid);
	if err != nil {
		return "", err
	}
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return nil, err
	}
	defer session.Close()

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (c:Comment)-[r:REPLY]->(p:Post)\n"+
			"WHERE id(p)=$postid\n"+
			"CALL { \n"+
			"WITH p \n"+
			"MATCH(u:User {email: p.email}) \n"+
			"RETURN u.firstName as userFirstName, u.lastName as userLastName \n"+
			"} \n"+
			"RETURN collect({firstName: userFirstName, lastName: userLastName, userProfile: p.userProfile, commentId: toString(c.commentId), content: c.content, time: c.time, likes: toString(c.likes), dislikes: toString(c.dislikes)}) as replies",
			map[string]interface{}{"postid":id})
		if err != nil {
			return nil, err
		}

		if result.Next() {
			value, _ := result.Record().Get("replies")
			return value, nil
		} else {
			return nil, nil
		}
	})

	return result, nil
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

//create likes relationship between user and post
func RatePost(driver neo4j.Driver, email string, postid string, operation string) (interface{}, error) {
	
	//convert id to int
	id, err := strconv.Atoi(postid);
	if err != nil {
		return false, err
	}
	
	query1 := ""
	query2 := ""
	//check if like already exists, if so then remove it.
	if operation == "like" {
		//check if like already exist
		ratingExists, rateerr := CheckLike(driver, email, postid);
		if rateerr != nil {
			return ratingExists, rateerr
		} else if ratingExists == true {
			//delete like
			query1 = ("MATCH (u:User{email:$email})-[r:LIKED]->(p:Post) \n"+
			"WHERE id(p)=$postid \n"+
			"DELETE r")
			query2 = "MATCH (p:Post) WHERE id(p)=$postid SET p.likes = p.likes - 1"
		} else{
			//create like
			query1 = ("MATCH (u:User{email:$email}), (p:Post) \n"+
			"WHERE id(p)=$postid \n"+
			"MERGE (u)-[r:LIKED]->(p)\n"+
			"SET p.likes = p.likes + 1")
	
			//delete a dislike if it exists
			// query2 = ("MATCH (u:User{email:$email})-[r:DISLIKED]->(p:Post) \n"+
			// "WHERE id(p)=$postid \n"+
			// "DELETE r")
			// query2
			// CALL{
			// 	MATCH (u:User{email:'k@mail.com'})-[r:DISLIKED]->(p:Post)
			// 	WHERE id(p)=1
			// 	RETURN p.postId as id1
			//    }
			// MATCH (p:Post)<-[r:DISLIKED]-(u:User{email:'k@mail.com'}) WHERE id(p)=id1
			// SET p.dislikes = p.dislikes - 1
			// DELETE r
			// RETURN id1

			// MATCH (p:Post) WHERE id(p)=1 SET p.likes=0, p.dislikes=0

			query2 = (
			"CALL{\n"+
				"MATCH (u:User{email:$email})-[r:DISLIKED]->(p:Post)\n"+
				"WHERE id(p)=$postid\n"+
				"RETURN p.postId as id1\n"+
			   "}\n"+
			"MATCH (p:Post)<-[r:DISLIKED]-(u:User{email:$email}) WHERE id(p)=id1\n"+
			"SET p.dislikes = p.dislikes - 1\n"+
			"DELETE r\n"+
			"RETURN id1")
		}

	} else {
		//chheck if dislike already exist
		ratingExists, rateerr := CheckDislike(driver, email, postid); 
		if rateerr != nil {
			return ratingExists, rateerr
		} else if ratingExists == true {
			//delete dislike
			query1 = ("MATCH (u:User{email:$email})-[r:DISLIKED]->(p:Post) \n"+
			"WHERE id(p)=$postid \n"+
			"DELETE r")
			query2 = "MATCH (p:Post) WHERE id(p)=$postid SET p.dislikes = p.dislikes - 1"
		} else{
			//create dislike
			query1 = ("MATCH (u:User{email:$email}), (p:Post) \n"+
			"WHERE id(p)=$postid \n"+
			"MERGE (u)-[r:DISLIKED]->(p)\n"+
			"SET p.dislikes = p.dislikes + 1")
	
			//delete a like if it exists
			// query2 = ("MATCH (u:User{email:$email})-[r:LIKED]->(p:Post) \n"+
			// "WHERE id(p)=$postid \n"+
			// "DELETE r")
			query2 = (
				"CALL{\n"+
					"MATCH (u:User{email:$email})-[r:LIKED]->(p:Post)\n"+
					"WHERE id(p)=$postid\n"+
					"RETURN p.postId as id1\n"+
				   "}\n"+
				"MATCH (p:Post)<-[r:LIKED]-(u:User{email:$email}) WHERE id(p)=id1\n"+
				"SET p.likes = p.likes - 1\n"+
				"DELETE r\n"+
				"RETURN id1")
		}
	}

	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return nil, err
	}
	defer session.Close()
	
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(query1,
			map[string]interface{}{"email": email,"postid":id})
	
			if err != nil {
				
				return nil, err
			}
			if result.Next() {
				
				return result.Record().GetByIndex(0), nil
			}
			
			return nil, nil
		})
	result2, err2 := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result2, err2 := transaction.Run(query2,
			map[string]interface{}{"email": email,"postid":id})
			
			
			if err2 != nil {
				
				return nil, err2
			}
			if result2.Next() {
				
				return result2.Record().GetByIndex(0), nil
			}
			
			return nil, nil
		})

	if err != nil || err2 != nil {
		var errstrings []string 

		err := fmt.Errorf("query1 error:")
		errstrings = append(errstrings, err.Error())

		err2 := fmt.Errorf("query2 error:%s", syscall.ENOPKG.Error())
		errstrings = append(errstrings, err2.Error())

		return fmt.Sprintf("%v%v", result, result2), fmt.Errorf(strings.Join(errstrings, "\n"))
	}
	return fmt.Sprintf("%v%v", result, result2), nil
}

func CheckLike(driver neo4j.Driver, email string, postid string) (bool, error){
	id, err := strconv.Atoi(postid);
	if err != nil {
		return false, err
	}
	query := ("MATCH (p:Post)<-[:LIKED]-(n:User {email:$email})\n"+
	"WHERE id(p)=$postid\n"+
	"RETURN count(n) > 0")
	result, err := CheckRating(driver, email, id, query)
	if err != nil {
		return false, err
	}
	return result, err
}

func CheckDislike(driver neo4j.Driver, email string, postid string) (bool, error){
	id, err := strconv.Atoi(postid);
	if err != nil {
		return false, err
	}
	query := ("MATCH (p:Post)<-[:DISLIKED]-(n:User {email:$email})\n"+
	"WHERE id(p)=$postid\n"+
	"RETURN count(n) > 0")
	result, err := CheckRating(driver, email, id, query)
	if err != nil {
		return false, err
	}
	return result, err
}


//first check if there is already existing like
func CheckRating(driver neo4j.Driver, email string, postid int, query string) (bool, error){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return false, err
	}
	defer session.Close()
	validation, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		// quering db
		result, err := transaction.Run(query,
			map[string]interface{}{"email":email,"postid":postid})
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

func GetLikes(driver neo4j.Driver, postid string) (interface{}, error){
	id, err := strconv.Atoi(postid);
	if err != nil {
		return "", err
	}
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		// quering db
		result, err := transaction.Run("MATCH (p:Post)\n"+
			"WHERE id(p)=$postid\n"+
			"RETURN p.likes",
			map[string]interface{}{"postid":id})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}
		return nil, result.Err()
	})
	return result, nil
}
func GetDislikes(driver neo4j.Driver, postid string) (interface{}, error){
	id, err := strconv.Atoi(postid);
	if err != nil {
		return "", err
	}
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		// quering db
		result, err := transaction.Run("MATCH (p:Post)\n"+
			"WHERE id(p)=$postid\n"+
			"RETURN p.dislikes",
			map[string]interface{}{"postid":id})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}
		return nil, result.Err()
	})
	return result, nil
}