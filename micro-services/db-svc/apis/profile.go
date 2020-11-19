package apis

import (
	"db-svc/queries"
	"encoding/json"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"cloud.google.com/go/storage"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	"google.golang.org/api/option"
	"google.golang.org/appengine"
)

type Profile struct {
	FirstName string
	LastName  string
	Email     string
	Phone     string
	About     string
}

func SetUpProfile(app *gin.Engine, driver neo4j.Driver) {

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
		js, err := json.Marshal(result)
		if err != nil {
			c.String(500, "Internal Error")
		}
		log.Println("-------------------88880999")
		log.Println(js)
		// type User struct{
		// 	firstName string
		// 	lastName string
		// }
		// a := User{
		// 	"fname","lname",
		// }
		c.JSON(200, result)
		// c.JSON(200, gin.H{
		// 	"user" : js,
		// })
	}))

	//add a new post
	//app.PATCH("/profile", func(c *gin.Context){
	app.PATCH("/profile", CheckAuthToken(func(c *gin.Context, _ string) {
		// bind
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			// Handle error
		}
		var profile Profile
		json.Unmarshal(jsonData, &profile)

		// log.Println("333---")
		// log.Println(profile.FirstName)
		// log.Println(profile.LastName)
		// log.Println(profile.Email)
		// log.Println(profile.Phone)
		// log.Println(profile.About)
		//err = client.Set("id", jsonData, 0).Err()
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
	var (
		storageClient *storage.Client
	)
	app.POST("/uploadProfilePic", CheckAuthToken(func(c *gin.Context, _ string) {
		bucket := "sportcred-user-profile-pic"

		var err error

		ctx := appengine.NewContext(c.Request)

		storageClient, err = storage.NewClient(ctx, option.WithCredentialsFile("keys.json"))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": err.Error(),
				"error":   true,
			})
			return
		}

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
