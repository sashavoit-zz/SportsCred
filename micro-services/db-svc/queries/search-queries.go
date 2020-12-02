package queries

import (
	"github.com/neo4j/neo4j-go-driver/neo4j"
	"log"
)

func SetupIndex(driver neo4j.Driver){
	IndexUser(driver)
	IndexPosts(driver)
}

func IndexUser(driver neo4j.Driver){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return
	}
	defer session.Close()
	session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error){
		transaction.Run(
			"CALL db.index.fulltext.createNodeIndex('userIndex',['User'],['email','firstName','lastName','about'])", nil)
			return nil, nil
		})
}
func IndexPosts(driver neo4j.Driver){
	log.Println("creating post index ----------------------------")
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return
	}
	defer session.Close()
	session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error){
		transaction.Run(
			"CALL db.index.fulltext.createNodeIndex('postIndex',['Post'],['content'])", nil)
			return nil, nil
	})
	return
}
// func QueryType(driver neo4j.Driver, input string) (string, error){


// 	session, err := driver.Session(neo4j.AccessModeWrite)
// 	if err != nil {
// 		return "", err
// 	}
// 	defer session.Close()
	
// 	//check if the query contains a username or email, or hashtag, or is just plaintext
// 	//emails will match (.*)@(.*)./com

// }

// CALL db.index.fulltext.queryNodes("stuff","game")
// YIELD node, score
// WITH node
// ORDER BY node.postTime DESC

// WITH COLLECT({content:node.content, time:node.postTime}) as result
// RETURN result

func QueryHashtags(driver neo4j.Driver, hashtags []string, query string, text string, skip int, pagesize int)(interface{}, error){
	hashtag := ""
	if len(hashtags) == 1 && len(text) == 0{
		log.Println("ONLY ONE HASHTAG")
		hashtag = hashtags[0]
		result, err := QueryHashtag(driver, hashtag, skip, pagesize)
		return result, err
	} else {
		query := ""
		for i, s := range hashtags{
			i = i
			query += s
		}
		log.Println(query)
		log.Println("MORE THAN ONE HASHTAG")
		log.Println(query)
		result, err := SearchQuery(driver, query, skip, pagesize)
		log.Println(query)
		log.Println(result)
		log.Println(err)
		return result, err
	}
}

func SearchQuery(driver neo4j.Driver, query string, skip int, pagesize int)(interface{}, error){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.ReadTransaction(func(transaction neo4j.Transaction) (interface{}, error){
		result, err := transaction.Run(
			"CALL db.index.fulltext.queryNodes('postIndex',$query)\n"+
			"YIELD node\n"+
			"WITH node\n"+
			"SKIP $skip LIMIT $pagesize\n"+
			"MATCH (u:User {email:node.email})\n"+
			"RETURN COLLECT({"+
				"firstName:u.firstName,"+
				"lastName:u.lastName,"+
				"profilePic:u.profilePic,"+
				"postId:toString(node.postId),"+
				"content:node.content,"+
				"time:node.postTime,"+
				"likes:toString(node.likes),"+
				"dislikes:toString(node.dislikes),"+
				"resultType:'post'"+
			"}) as posts",
			map[string]interface{}{"query":query,"skip":skip,"pagesize":pagesize})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			value, _ := result.Record().Get("posts")
			log.Println(value)
			return value, nil
		}else{
			return nil, nil
		}

		return nil, result.Err()
	})
	return result, nil

}

// 		"MATCH (n: User) \n"+
// 		"WHERE toLower(n.firstName) CONTAINS toLower($username) OR toLower(n.lastName) CONTAINS toLower($username) \n"+
// 		"WITH n \n"+
// 		"ORDER BY n.firstName \n"+
// 		"SKIP $skip LIMIT $pagesize \n"+
// 		"WITH COLLECT({id:n.id,avatar:n.avatar,username:n.firstName,status:n.about,email:n.email}) AS result \n"+
// 		"RETURN result",

func QueryHashtag(driver neo4j.Driver, hashtag string, skip int, pagesize int)(interface{}, error){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.ReadTransaction(func(transaction neo4j.Transaction) (interface{}, error){
		result, err := transaction.Run(
			"CALL{\n"+
				"MATCH (p:Post)\n"+
				"MATCH (u:User)-[:CREATED]->(p)\n"+
				"WHERE toLower(p.content) CONTAINS toLower($hashtag)"+
				"RETURN u.firstName as firstname, u.lastName as lastname, u.profilePic as profilePic, p\n"+
				//"ORDER BY p.postTime DESC\n"+
				"SKIP $skip LIMIT $pagesize\n"+
				"}\n"+
				"RETURN collect({"+
					"firstName: firstname,"+
					"lastName: lastname,"+
					"profilePic: profilePic,"+
					"postId: toString(p.postId),"+
					"content: p.content,"+
					"time: p.postTime,"+
					"likes: toString(p.likes),"+
					"dislikes: toString(p.dislikes),"+
					"resultType:'post'"+
				"})\n"+
				"as posts",
		map[string]interface{}{"hashtag":hashtag,"skip":skip,"pagesize":pagesize})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			value, _ := result.Record().Get("posts")
			log.Println(value)
			return value, nil
		}else{
			return nil, nil
		}

		return nil, result.Err()
	})
	return result, nil
}

func QueryUsers(driver neo4j.Driver, emails []string, query string, text string, skip int, pagesize int)([]interface{}, error){
	var res []interface{}
	email := ""
	if len(emails) == 1 && len(text) == 0{
		log.Println("there are emails")
		email = emails[0]
		pagesize = pagesize - 1
		//query on direct email first, then query on string text match
		directUser, direrr := QueryEmail(driver, email)
		log.Println("direct email")
		log.Println(directUser)
		log.Println(direrr)
		if direrr != nil {
			return res, direrr
		} else {
			res = append(res, directUser)
		}
	} else {
		session, err := driver.Session(neo4j.AccessModeWrite)
		if err != nil {
			return res, err
		}
		defer session.Close()
		log.Println("got here")
		log.Println(query)
		result, err := session.ReadTransaction(func(transaction neo4j.Transaction) (interface{}, error){
			result, err := transaction.Run(
				"CALL db.index.fulltext.queryNodes('userIndex',$query)\n"+
				"YIELD node\n"+
				"WITH node\n"+
				"SKIP $skip LIMIT $pagesize\n"+
				"WITH COLLECT({"+
					"profilePic:node.profilePic,"+
					"username:node.firstName,"+
					"about:node.about,"+
					"email:node.email,"+
					"resultType:'user'"+
					"}) as result\n"+
				"RETURN result",
				map[string]interface{}{"query":query,"skip":skip,"pagesize":pagesize})
				if err != nil{
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
		if err != nil {
			return res, err
		} else {
			res = append(res, result)
		}
	}
	//flatten result array
	//log.Println(flatten(res))
	//res = flatten(res)
	return res, nil
	
}

// func flatten(arr interface{})([]interface{}){
// 	result := flattenhelper(nil, arr)
// 	return result
// }

// func flattenhelper(stack []interface{}, arr interface{})([]interface{}){
// 	switch x := arr.(type) {
// 	case []interface{}:
// 		for _, slice := range x {
// 			stack = flattenhelper(stack, slice)
// 		}
// 	default:
// 		stack = append(stack , x)
// 	}
// 	return stack
// }

// func flattenhelper(arr interface{})([]interface{}){
// 	var res []interface{}
// 	switch x := arr.(type) {
// 	case []interface{}:
// 		if len(x) == 0{
// 			return res
// 		}
// 		first, rest := x[0], x[1:]
// 		return append(flattenhelper(first), flattenhelper(rest))
// 	default:
// 		return append(res, arr)
// 	}
// }

// func flattenhelper(arr []interface{})([]interface{}){
// 	var result interface{}
// 	for i, j := range arr{
// 		switch x := j.(type) {
// 		case []interface{}:
// 			result = append(result, flatten(x))
// 		default:
// 			result = append(result, j)
// 		}
// 		// if j.([]interface{}){
// 		// 	result = append(result, flatten(j))
// 		// } else {
// 		// 	result = append(result, j)
// 		// }
		
// 		log.Println(j)
// 		log.Println(i)
// 	}
// 	return result
// }


// id:n.id,
// avatar:n.avatar,
// username:n.firstName,
// status:n.about,
// email:n.email

func QueryEmail(driver neo4j.Driver, email string)(interface{}, error){
	log.Println("querying email")
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.ReadTransaction(func(transaction neo4j.Transaction) (interface{}, error){
		result, err := transaction.Run(
		"MATCH (n: User) \n"+
		"WHERE toLower(n.email) CONTAINS toLower($email) \n"+
		"WITH COLLECT({"+
			"id:n.id,"+
			"avatar:n.avatar,"+
			"username:n.firstName,"+
			"status:n.about,"+
			"email:n.email,"+
			"resultType:'user'"+
		"}) AS result \n"+
		"RETURN result",
		map[string]interface{}{"email":email})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			value, _ := result.Record().Get("result")
			log.Println(value)
			return value, nil
		}else{
			return nil, nil
		}

		return nil, result.Err()
	})
	return result, nil
}

// func QueryUsers(driver neo4j.Driver, name string, skip int, pagesize int)(interface{}, error){
// 	session, err := driver.Session(neo4j.AccessModeWrite)
// 	if err != nil {
// 		return "", err
// 	}
// 	defer session.Close()
// 	result, err := session.ReadTransaction(func(transaction neo4j.Transaction) (interface{}, error){
// 		result, err := transaction.Run(
// 		"MATCH (n: User) \n"+
// 		"WHERE toLower(n.firstName) CONTAINS toLower($username) OR toLower(n.lastName) CONTAINS toLower($username) \n"+
// 		"WITH n \n"+
// 		"ORDER BY n.firstName \n"+
// 		"SKIP $skip LIMIT $pagesize \n"+
// 		"WITH COLLECT({id:n.id,avatar:n.avatar,username:n.firstName,status:n.about,email:n.email}) AS result \n"+
// 		"RETURN result",
// 		map[string]interface{}{"username":name,"skip":skip,"pagesize":pagesize})
// 		if err != nil {
// 			return nil, err
// 		}
// 		if result.Next() {
// 			value, _ := result.Record().Get("result")
// 			return value, nil
// 		}else{
// 			return nil, nil
// 		}

// 		return nil, result.Err()
// 	})
// 	return result, nil
// }
//