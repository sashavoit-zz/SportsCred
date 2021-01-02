package apis

import (
	"back-end/queries"
	"encoding/json"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"cloud.google.com/go/storage"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	"google.golang.org/appengine"
)

type Profile struct {
	FirstName string
	LastName  string
	Email     string
	Phone     string
	About     string
}
type AcsOffset struct {
	Email  string
	Offset int
	Debate bool
	Trivia bool
}

func SetUpProfile(app *gin.Engine, driver neo4j.Driver, storageClient *storage.Client) {
	app.GET("/friendslist/:user", func(c *gin.Context) {
		user := c.Param("user")
		result, err := queries.GetFriendsList(driver, user)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if result == "" {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
		}

		//js, err := json.Marshal(result)
		if err != nil {
			c.String(500, "Internal Error")
		}
		log.Println("here are the results")
		log.Println(result)
		c.JSON(200, result)
	})

	app.PUT("/friend/:user/add/:stranger", func(c *gin.Context) {
		user := c.Param("user")
		stranger := c.Param("stranger")

		result, err := queries.FollowUser(driver, user, stranger)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if result == "" {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
		}

		//js, err := json.Marshal(result)
		if err != nil {
			c.String(500, "Internal Error")
		}
		log.Println("here are the results")
		log.Println(result)
		c.JSON(200, result)
	})

	app.GET("/profile/:email", func(c *gin.Context) {
		email := c.Param("email")
		log.Println("got user email")

		result, err := queries.GetProfile(driver, email)

		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if result == "" {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
		}

		//js, err := json.Marshal(result)
		if err != nil {
			c.String(500, "Internal Error")
		}
		log.Println("here are the results")
		log.Println(result)
		c.JSON(200, result)

	})

	app.GET("/isfriend", func(c *gin.Context) {
		user := c.Query("user")
		stranger := c.Query("stranger")

		result, err := queries.CheckFriend(driver, user, stranger)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		}
		c.JSON(200, result)
	})

	// =======
	// }

	// func SetUpProfile(app *gin.Engine, driver neo4j.Driver){
	// >>>>>>> master

	/// Route for getting all exisiting reports
	app.GET("/user/:email", CheckAuthToken(func(c *gin.Context, _ string) {
		email := c.Param("email")
		//add the user to the database
		result, err := queries.GetUserByEmail(driver, email)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if result == "" {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}
		log.Println("-------------------88880")
		log.Println(result)
		// js, err := json.Marshal(result)
		// if err != nil {
		// 	c.String(500, "Internal Error")
		// }
		// log.Println("-------------------88880999")
		// log.Println(js)
		c.JSON(200, result)
		// c.JSON(200, gin.H{
		// 	"user" : js,
		// })
	}))

	//add a new profile
	//app.PATCH("/profile", func(c *gin.Context){
	app.PATCH("/profile", CheckAuthToken(func(c *gin.Context, _ string) {
		// bind
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			// Handle error
		}
		var profile Profile
		json.Unmarshal(jsonData, &profile)

		firstName := profile.FirstName
		lastName := profile.LastName
		email := profile.Email
		phone := profile.Phone
		about := profile.About

		//add the user to the database
		result, err := queries.UpdateProfile(driver, firstName, lastName, email, phone, about)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if result == "" {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}
		c.JSON(200, gin.H{
			"good": "this is how to send JSON to user",
		})
	}))

	// Route for getting user acs
	// return example: 3
	app.GET("/acs/:email", CheckAuthToken(func(c *gin.Context, _ string) {
		email := c.Param("email")
		//add the user to the database
		result, err := queries.GetUserAcsByEmail(driver, email)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if result == "" {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}
		// log.Println("-------------------88880999")
		// log.Println(result)
		c.JSON(200, result)
		// c.JSON(200, gin.H{
		// 	"user" : js,
		// })
	}))

	// Route for getting user acs history
	// return example: [0@1605300788386 4@1605300788386 13@1605301269303 3@1605301289033]
	app.GET("/acsHistory/:email", CheckAuthToken(func(c *gin.Context, _ string) {
		email := c.Param("email")
		//add the user to the database
		result, err := queries.GetAcsHistoryByEmail(driver, email)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if result == "" {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}
		log.Println("------------------995566")
		log.Println(result)
		c.JSON(200, result)
		// c.JSON(200, gin.H{
		// 	"user" : js,
		// })
	}))

	app.PATCH("/acs", CheckAuthToken(func(c *gin.Context, _ string) {
		// bind
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			// Handle error
		}
		var acsInput AcsOffset
		json.Unmarshal(jsonData, &acsInput)

		email := acsInput.Email
		addValue := acsInput.Offset
		debate := acsInput.Debate
		trivia := acsInput.Trivia
		log.Println("-------------------ddbatetrivia")
		log.Println(debate)
		log.Println(trivia)
		//add the addValue to acs
		result, err := queries.UpdateACS(driver, email, addValue, debate, trivia)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if result == "" {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}
		c.JSON(200, gin.H{
			"acs": "updated",
		})
	}))

	app.POST("/uploadProfilePic", CheckAuthToken(func(c *gin.Context, _ string) {
		bucket := "sportcred-user-profile-pic"
		ctx := appengine.NewContext(c.Request)
		f, uploadedFile, err := c.Request.FormFile("file")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": err.Error(),
				"error":   true,
			})
			return
		}
		currentTime := time.Now()
		uploadedFile.Filename += currentTime.String()
		email := c.PostForm("email")

		defer f.Close()

		sw := storageClient.Bucket(bucket).Object(uploadedFile.Filename).NewWriter(ctx)

		if _, err := io.Copy(sw, f); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": err.Error(),
				"error":   true,
			})
			return
		}

		if err := sw.Close(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": err.Error(),
				"error":   true,
			})
			return
		}

		u := "https://storage.googleapis.com/" + bucket + "/" + sw.Attrs().Name
		result, err := queries.UploadProfilePic(driver, email, u)
		if err != nil {
			c.String(500, "Internal Error")
		} else if result == nil {
			c.String(400, "Bad Request")
		}

		c.JSON(200, result)

	}))
	app.GET("/getUserProfilePic/:email", CheckAuthToken(func(c *gin.Context, _ string) {
		email := c.Param("email")
		result, err := queries.GetUserProfilePic(driver, email)
		if err != nil {
			c.String(500, "Internal Error")
		} else if result == "" {
			c.String(400, "Bad Request")
		}
		if err != nil {
			c.String(500, "Internal Error")
		}

		c.JSON(200, result)

	}))

}
