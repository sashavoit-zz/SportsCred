package apis

import (
	//"db-svc/queries"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
)
/*
func SetUpOpenCourt(app *gin.Engine, driver neo4j.Driver){

	app.GET("/allPosts", func(c *gin.Context){
		result, err := queries.LoadAllPosts(driver)
		if err!=nil{
			c.String(500, "Internal server error")
			return
		}else if result == nil{
			c.String(404, "Not found")
			return
		}

		c.JSON(200, result)
	})

}
*/