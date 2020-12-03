package apis

import (
	"log"
	"db-svc/queries"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	
	"encoding/base64"
	"strconv"
	"strings"
	"regexp"
)

// import (
// 	"github.com/mitchellh/mapstructure"
// 	"fmt"
// )

type SearchQuery struct{
	Query string
	CurrPage int
	PageCount int
}
type QProfile struct{
	Id string
	Avatar string
	Username string
	Status string
	Email string
}
type Result struct{
	Total int
	Profiles []QProfile
}

func flatten(arr interface{})([]interface{}){
	result := flattenhelper(nil, arr)
	return result
}

func flattenhelper(stack []interface{}, arr interface{})([]interface{}){
	switch x := arr.(type) {
	case []interface{}:
		for _, slice := range x {
			stack = flattenhelper(stack, slice)
		}
	default:
		stack = append(stack , x)
	}
	return stack
}


func SetUpSearch(app *gin.Engine, driver neo4j.Driver){
	queries.SetupIndex(driver)

	app.GET("/search/:type/", func(c *gin.Context){
		searchtype := c.Param("type")
		log.Println("SERACH TYPE")
		log.Println(searchtype)
		log.Println(searchtype == "users")
		querystring := c.Query("search")
		parameters := c.Query("params")
		l, _ := base64.StdEncoding.DecodeString(parameters)
		//log.Println(querystring)
		s := string([]byte(l))
		params := strings.Split(s, "&")
		//fmt.Println(params)
		//user, type, currpage, pagecount
		user := params[0]
		//querytype := params[1]
		currpage, err := strconv.Atoi(params[1])
		pagecount, err := strconv.Atoi(params[2])
		if err != nil{
			//bla
			c.String(500, "Internal Error")
		}
		log.Println(user)
		log.Println("alsjdhalsjhflkashfjkahdahskjdlkahj")
		log.Println(err)
		//log.Println(currpage)
		//log.Println(pagecount)
		var emailID = regexp.MustCompile("(.+)@(.+)(\\.)(.+)")
		var hashtag = regexp.MustCompile("(\\#[a-zA-Z0-9])")
		var emails []string
		var hashtags []string
		text := ""
		//tokenize query
		tokens := strings.Split(querystring, " ")
		log.Println(querystring)
		log.Println(tokens)
		for i, s := range tokens {
			log.Println(i)
			log.Println(s)
			i = i
			if emailID.MatchString(s) {
				emails = append(emails, s)
			} else if hashtag.MatchString(s) {
				hashtags = append(hashtags, s)
			} else{
				log.Println("adding to text")
				log.Println(s)
				text += s+" "
			}
		}
		log.Println(emails)
		log.Println(hashtags)
		log.Println(text)

		var res []interface{}
		var posts interface{}
		var qerr error
		if searchtype == "users"{
			res, err = queries.QueryUsers(driver, emails, querystring, text, currpage * pagecount, pagecount)
		} else {
			if len(hashtags) > 0 {
				posts, qerr = queries.QueryHashtags(driver, hashtags, querystring, text, currpage * pagecount, pagecount)
				//if query contains hashtag, query hashtag posts first,
				//then leftovertext fullstring match on posts, then profiles
			} else{
				posts, qerr = queries.SearchQuery(driver, querystring, currpage * pagecount, pagecount)
				//else search on fulltext index
			}
		}

		//if the query contains an email, query user emails first,
		//then leftovertext is fullstring match on profiles, then posts
		//posts, err := queries.QueryHashtags(driver, hashtags, text, currpage * pagecount, pagecount)

		// var posts interface{}
		// var qerr error
		// if len(hashtags) > 0 {
		// 	posts, qerr = queries.QueryHashtags(driver, hashtags, querystring, text, currpage * pagecount, pagecount)
		// 	//if query contains hashtag, query hashtag posts first,
		// 	//then leftovertext fullstring match on posts, then profiles
		// } else{
		// 	posts, qerr = queries.SearchQuery(driver, querystring, currpage * pagecount, pagecount)
		// 	//else search on fulltext index
		// }
		log.Println("got here 4")
		log.Println(err)
		log.Println(qerr)
		log.Println("got here 4.5")
		if(err != nil || qerr != nil){
			var errstrings []string 


			errstrings = append(errstrings, err.Error())

			errstrings = append(errstrings, qerr.Error())
			c.JSON(500, errstrings)
		}
		log.Println("got here 5")
		res = append(res, posts)
		log.Println(flatten(res))

		c.JSON(200, flatten(res))








		//ignoring queryType for now as all query will be for user
		//result, err := queries.QueryUsers(driver, querystring, currpage * pagecount, pagecount)

		//log.Println(result);
		//fmt.Println("map:",result)

		// var res Result
		// res.Profiles = make([]QProfile, 0)
		
		// totalresults := 0
		// //log.Println("printing map")
		// //log.Println(totalresults)

		// for key, value := range result.([]interface{}) {
		// 	totalresults += 1
		// 	// key == id, label, properties, etc
		// 	fmt.Println("Key:", key, "=>", "Value:", value)
		// 	var newprofile QProfile
		// 	mapstructure.Decode(value, &newprofile)
		// 	res.Profiles = append(res.Profiles, newprofile)
		// }
		// res.Total = totalresults
		// if err != nil{
		// 	c.String(500, "Internal Error")
		// }
		// c.JSON(200, res)

	})


}