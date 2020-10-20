package queries

import (
	"github.com/neo4j/neo4j-go-driver/neo4j"
)

func LoadAllPosts(driver neo4j.Driver)(interface{}, error){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return nil, err
	}
	defer session.Close()

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error){
		result, err := transaction.Run(
			"MATCH(p: Post) \n"+
				"CALL { \n" +
				"WITH p \n" +
				"MATCH(u:User {email: p.email}) \n"+
				"RETURN u.firstName as userFirstName, u.lastName as userLastName \n"+
				"} \n" +
				"RETURN collect({firstName: userFirstName, lastName: userLastName, postId: toString(p.postId), content: p.content, time: p.time, likes: toString(p.likes), dislikes: toString(dislikes)}) as posts",
			map[string]interface{}{})
		if err != nil {
			return nil, err
		}

		if result.Next() {
			value, _ := result.Record().Get("posts")
			return value, nil
		}else{
			return nil, nil
		}
	})

	return result, nil
}
