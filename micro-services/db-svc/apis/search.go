package apis

import (
	"log"
	"db-svc/queries"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	
	"strings"
	"regexp"
)

// import (
// 	"encoding/base64"
// 	"strconv"
// )

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
		querystring := c.Query("search")
		querystring = strings.ReplaceAll(querystring, "-","#")

		// parameters := c.Query("params")
		// l, _ := base64.StdEncoding.DecodeString(parameters)
		//log.Println(querystring)
		// s := string([]byte(l))
		// params := strings.Split(s, "&")
		//fmt.Println(params)
		//user, type, currpage, pagecount
		// user := params[0]
		//querytype := params[1]
		// currpage, err := strconv.Atoi(params[1])
		// pagecount, err := strconv.Atoi(params[2])
		// if err != nil{
		// 	//bla
		// 	c.String(500, "Internal Error")
		// }
		log.Println("ASDLKAJSLDKAJSDLKAJSK")
		log.Println(querystring)
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

		currpage := 0
		pagecount := 10
		var res []interface{}
		var posts interface{}
		var qerr error
		var err error
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
		if(err != nil || qerr != nil){
			var errstrings []string 
			errstrings = append(errstrings, err.Error())

			errstrings = append(errstrings, qerr.Error())
			c.JSON(500, errstrings)
		}
		res = append(res, posts)
		log.Println(flatten(res))
		bruh := flatten(res)
		newSlice := make([]interface{}, 0, len(bruh))
		for _, item := range bruh {
			if item != nil {
				newSlice = append(newSlice, item)
			}
		}
		c.JSON(200, newSlice)

	})


}