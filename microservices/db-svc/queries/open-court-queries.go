package queries

import (
	"github.com/neo4j/neo4j-go-driver"
)

/*func LoadAllPosts(driver neo4j.Driver)(interface{}, error){
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
				"MATCH(:User)-[likes:LIKES]->(p) \n"+
				"MATCH(:User)-[dislikes:DISLIKES]->(p) \n"+
				"RETURN toString(count(likes)) as likesNum, toString(count(dislikes)) as dislikesNum"+
				"} \n" +
				"RETURN collect({userId: p.userId, postId: toString(p.postId), content: p.content, time: p.time, likes: likesNum, dislikes: dislikesNum}) as posts",
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
*/