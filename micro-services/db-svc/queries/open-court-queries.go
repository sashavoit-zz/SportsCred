package queries

import (
	"fmt"
	"strconv"
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
			query2 = "RETURN NULL"
		} else{
			//create like
			query1 = ("MATCH (u:User{email:$email}), (p:Post) \n"+
			"WHERE id(p)=$postid \n"+
			"MERGE (u)-[r:LIKED]->(p)")
	
			//delete a dislike if it exists
			query2 = ("MATCH (u:User{email:$email})-[r:DISLIKED]->(p:Post) \n"+
			"WHERE id(p)=$postid \n"+
			"DELETE r")
		}

	} else {
		//chheck if dislike already exist
		ratingExists, rateerr := CheckDislike(driver, email, postid); 
		if rateerr != nil {
			return ratingExists, rateerr
		} else if ratingExists == true {
			//delete like
			query1 = ("MATCH (u:User{email:$email})-[r:DISLIKED]->(p:Post) \n"+
			"WHERE id(p)=$postid \n"+
			"DELETE r")
			query2 = "RETURN NULL"
		} else{
			//create dislike
			query1 = ("MATCH (u:User{email:$email}), (p:Post) \n"+
			"WHERE id(p)=$postid \n"+
			"MERGE (u)-[r:DISLIKED]->(p)")
	
			//delete a like if it exists
			query2 = ("MATCH (u:User{email:$email})-[r:LIKED]->(p:Post) \n"+
			"WHERE id(p)=$postid \n"+
			"DELETE r")
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