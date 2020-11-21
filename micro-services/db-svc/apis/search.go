package apis

import (
	"log"
	"db-svc/queries"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	"github.com/mitchellh/mapstructure"
	"encoding/base64"
	"strconv"
	"strings"
	"fmt"
)

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



func SetUpSearch(app *gin.Engine, driver neo4j.Driver){

	app.GET("/search", func(c *gin.Context){
		querystring := c.Query("search")
		parameters := c.Query("params")
		l, _ := base64.StdEncoding.DecodeString(parameters)
		//log.Println(querystring)
		s := string([]byte(l))
		params := strings.Split(s, "&")
		//fmt.Println(params)
		//user, type, currpage, pagecount
		user := params[0]
		querytype := params[1]
		currpage, err := strconv.Atoi(params[2])
		pagecount, err := strconv.Atoi(params[3])
		if err != nil{
			//bla
			c.String(500, "Internal Error")
		}
		log.Println(user)
		log.Println(querytype)
		//log.Println(currpage)
		//log.Println(pagecount)

		//ignoring queryType for now as all query will be for user
		result, err := queries.QueryUsers(driver, querystring, currpage * pagecount, pagecount)

		//log.Println(result);
		//fmt.Println("map:",result)

		var res Result
		res.Profiles = make([]QProfile, 0)
		
		totalresults := 0
		//log.Println("printing map")
		//log.Println(totalresults)

		for key, value := range result.([]interface{}) {
			totalresults += 1
			// key == id, label, properties, etc
			fmt.Println("Key:", key, "=>", "Value:", value)
			var newprofile QProfile
			mapstructure.Decode(value, &newprofile)
			res.Profiles = append(res.Profiles, newprofile)
		}
		res.Total = totalresults
		if err != nil{
			c.String(500, "Internal Error")
		}
		c.JSON(200, res)

	})


}