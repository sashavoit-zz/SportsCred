package main

import (
    "fmt"
    "log"
    //"net/http"
	"io/ioutil"
	"github.com/json-iterator/go"
    //"encoding/json"
	//"text/template"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
)
var json = jsoniter.ConfigCompatibleWithStandardLibrary

// need edit this become more safer
func CORSMiddleware() gin.HandlerFunc { 
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
		c.Header("Access-Control-Allow-Methods", "POST,HEAD,PATCH, OPTIONS, GET, PUT")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204) // 2xx code is fine
			return
		}
		c.Next()
	}
}


func main() {
	// db information
	URI := "bolt://localhost:7687" 
	DBNAME := "neo4j"
	DBPASS := "1234"
	ENCRYPTED := false

	//db connection
	driver, err := neo4j.NewDriver(URI, neo4j.BasicAuth(DBNAME, DBPASS, ""), func(c *neo4j.Config) {
		c.Encrypted = ENCRYPTED
	})
	if err != nil {
		log.Fatal(err) // print error and stop
	}
	log.Println("Connected to Neo4j")
	defer driver.Close() // close connection when main function return
	
	//GIN router documentation here: https://github.com/gin-gonic/gin
	app := gin.New()
	app.Use(CORSMiddleware())
	app.Use(gin.Logger())
	app.Use(gin.Recovery())
	
	

	app.GET("/ping", func(c *gin.Context){
		c.JSON(200, gin.H{"message":"pong",})
	})

	//add user
	app.POST("/addUser/:username/:password", func(c *gin.Context){
		username := c.Param("username")
		password := c.Param("password")
		//add the user to the database
		result, err := addUser(driver, username, "email", password)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		}else if result == ""{
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}
		c.JSON(200, gin.H{
			"Note":  "this is how to send JSON to user",
			"x": 3.14,
			"y": result,
		})
	})


	//check user and password, should use the hash inside url instead of json body
	type Person struct{
		User string
		Password string
	}
	app.POST("/checkUser/:hash", func(c *gin.Context){
		// bind
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
		    // Handle error
		}
		var person Person
		json.Unmarshal(jsonData, &person)
		log.Println(person.User)
		log.Println(person.Password)
		//err = client.Set("id", jsonData, 0).Err()
		username := person.User
		password := person.Password


		//check if password + username is valid
		result, err := checkPassword(driver, username, password)

		if err != nil {
			// 500 failed check user
			c.String(500, "Internal Error")
		}else if result == ""{
			// 401 Unauthorized (not exist or wrong password)
			c.String(401, "Unauthorized")
		}
		//if it is valid, generate token

		c.JSON(200, gin.H{"token":result,})

		
	})

	type Profile struct{
		Name string
		Email string
		Phone string
		About string
	}
	app.PATCH("/profile", func(c *gin.Context){
		// bind
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
		    // Handle error
		}
		var profile Profile
		json.Unmarshal(jsonData, &profile)
		log.Println("2222---")
		log.Println(profile.Name)
		log.Println(profile.Email)
		//err = client.Set("id", jsonData, 0).Err()
		name := profile.Name
		email := profile.Email
		phone := profile.Phone
		about := profile.About

		//add the user to the database
		result, err := updateProfile(driver, name, email, phone, about)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		}else if result == ""{
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}
		c.JSON(200, gin.H{
			"Note":  "this is how to send JSON to user",
			"x": 3.14,
			"y": result,
		})
	})

	//handleRequests()
	app.Run(":3001")
}

func addUser(driver neo4j.Driver, name string, email string, password string)(string, error){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"CREATE (n:User {name:$name, email:$email, password:$password})", // or MERGE
			map[string]interface{}{"name": name, "email": email, "password": password})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}
		return nil, result.Err()
	})
	return fmt.Sprintf("%v",result), nil
}

func checkPassword(driver neo4j.Driver, name string, password string)(string, error){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"match (n:User{name:$name,password:$password}) return n",
			map[string]interface{}{"name": name, "password": password})
		if err != nil {
			return nil, err
		}
		// if result.Next() {
		// 	return result.Record().GetByIndex(0), nil
		// }
		return result.Next(), result.Err()
	})
	return fmt.Sprintf("%v",result), nil
}


func updateProfile(driver neo4j.Driver, name string, email string, phone string, about string)(string, error){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (u:User {email:$email}) SET u += {name:$name, about:$about, phone:$phone}",
			map[string]interface{}{"name": name, "email": email, "about": about, "phone": phone})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}
		return nil, result.Err()
	})
	return fmt.Sprintf("%v",result), nil
}

