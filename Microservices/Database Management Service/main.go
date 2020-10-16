package main

import (
	"fmt"
	"log"

	//"net/http"
	"io/ioutil"

	jsoniter "github.com/json-iterator/go"

	//"encoding/json"
	//"text/template"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
)

var json = jsoniter.ConfigCompatibleWithStandardLibrary

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
	app.Use(gin.Logger())
	app.Use(gin.Recovery())

	app.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	//add user
	app.POST("/addUser/:username/:password", func(c *gin.Context) {
		username := c.Param("username")
		password := c.Param("password")
		//add the user to the database
		result, err := addUser(driver, username, "email", password)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if result == "" {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}
		c.JSON(200, gin.H{
			"Note": "this is how to send JSON to user",
			"x":    3.14,
			"y":    result,
		})
	})

	//Question struct
	type Question struct {
		Question string
		Option1  string
		Option2  string
		Option3  string
		Answer   string
	}
	app.POST("/addQuestion/:hash", func(c *gin.Context) {
		// bind
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			// Handle error
		}
		var questionStruct Question
		json.Unmarshal(jsonData, &questionStruct)

		question := questionStruct.Question
		option1 := questionStruct.Option1
		option2 := questionStruct.Option2
		option3 := questionStruct.Option3
		answer := questionStruct.Answer

		//add question to the database
		result, err := addQuestion(driver, question, option1, option2, option3, answer)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if result == "" {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}
		c.JSON(200, gin.H{
			"Note": "Question added successfully.",
		})
	})

	// QuestionRelationship struct
	type QuestionRelationship struct {
		Question string
		User     string
	}
	app.POST("/addQuestionRelationship/:hash", func(c *gin.Context) {
		// bind
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			// Handle error
		}
		var relationship QuestionRelationship
		json.Unmarshal(jsonData, &relationship)

		question := relationship.Question
		user := relationship.User

		//add question to the database
		result, err := addQuestionRelationship(driver, question, user)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if result == "" {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}
		c.JSON(200, gin.H{
			"Note": "Question added successfully.",
		})
	})

	app.GET("/getQuestion/:hash", func(c *gin.Context) {
		// bind
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			// Handle error
		}
		var relationship QuestionRelationship
		json.Unmarshal(jsonData, &relationship)

		question := relationship.Question

		// get question from db
		result, err := getQuestion(driver, question)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if len(result) == 0 {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}
		c.JSON(200, gin.H{
			"question": result[0],
			"option1":  result[1],
			"option2":  result[2],
			"option3":  result[3],
			"answer":   result[4],
		})
	})

	app.POST("/deleteQuestionRelationship/:hash", func(c *gin.Context) {
		// bind
		jsonData, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			// Handle error
		}
		var relationship QuestionRelationship
		json.Unmarshal(jsonData, &relationship)

		question := relationship.Question
		user := relationship.User

		//delete relationship from db
		result, err := deleteQuestionRelationship(driver, question, user)
		if err != nil {
			// 500 failed add user
			c.String(500, "Internal Error")
		} else if result == "" {
			// 400 bad request (not exist or wrong password)
			c.String(400, "Bad Request")
			//c.JSON(400, gin.H{"message":"pong",})
		}
		c.JSON(200, gin.H{
			"Note": "Question removed successfully.",
		})
	})

	//check user and password, should use the hash inside url instead of json body
	type Person struct {
		User     string
		Password string
	}
	app.POST("/checkUser/:hash", func(c *gin.Context) {
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
		} else if result == "" {
			// 401 Unauthorized (not exist or wrong password)
			c.String(401, "Unauthorized")
		}
		//if it is valid, generate token

		c.JSON(200, gin.H{"token": result})

	})
	//handleRequests()
	app.Run(":3001")
}

func addUser(driver neo4j.Driver, name string, email string, password string) (string, error) {
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
	return fmt.Sprintf("%v", result), nil
}

func checkPassword(driver neo4j.Driver, name string, password string) (string, error) {
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
	return fmt.Sprintf("%v", result), nil
}

func addQuestion(driver neo4j.Driver, question string, option1 string, option2 string, option3 string, answer string) (string, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"CREATE (n:Question {question:$question, option1:$option1, option2:$option2, option3:$option3, answer:$answer})", // or MERGE
			map[string]interface{}{"question": question, "option1": option1, "option2": option2, "option3": option3, "answer": answer})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}
		return nil, result.Err()
	})
	return fmt.Sprintf("%v", result), nil
}

func addQuestionRelationship(driver neo4j.Driver, question string, user string) (string, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (a:Question {question:$question}),(t:User {name:$user})\n"+"MERGE (t)-[r:NOT_ANSWERED]->(a)\n"+"RETURN r", // or MERGE
			map[string]interface{}{"question": question, "user": user})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}
		return nil, result.Err()
	})
	return fmt.Sprintf("%v", result), nil
}

func getQuestion(driver neo4j.Driver, question string) ([6]string, error) {
	var responseBody [6]string

	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return responseBody, err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (n:Question {question:$question})\n"+"RETURN n.question, n.option1, n.option2, n.option3, n.answer", // or MERGE
			map[string]interface{}{"question": question})
		if err != nil {
			return nil, err
		}
		if result.Next() {

			responseBody[0] = question
			responseBody[1] = result.Record().GetByIndex(1).(string)
			responseBody[2] = result.Record().GetByIndex(2).(string)
			responseBody[3] = result.Record().GetByIndex(3).(string)
			responseBody[4] = result.Record().GetByIndex(4).(string)

			return result.Record().GetByIndex(0), nil
		}
		return nil, result.Err()
	})

	resulter := result.(string)
	responseBody[5] = resulter

	return responseBody, nil
}

func deleteQuestionRelationship(driver neo4j.Driver, question string, user string) (string, error) {
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return "", err
	}
	defer session.Close()
	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (a:Question {question:$question})-[r:NOT_ANSWERED]-(t:User {name:$user})\n"+"DELETE r", // or MERGE
			map[string]interface{}{"question": question, "user": user})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}
		return nil, result.Err()
	})
	return fmt.Sprintf("%v", result), nil
}
