package apis

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
)

var neo4jDriver1 neo4j.Driver // used in all db related funcs

func setSignUpDBConstraint() (bool, error) {
	session, err := neo4jDriver1.Session(neo4j.AccessModeWrite)
	if err != nil {
		return false, err
	}
	defer session.Close()

	session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"CREATE CONSTRAINT ON (n:User) ASSERT n.email IS UNIQUE",
			map[string]interface{}{"message": "hello, world"})
		if err != nil {
			return nil, err
		}

		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}

		return nil, result.Err()
	})

	return true, nil
}

func checkEmailExists(email string) (bool, error) {
	// session set up
	session, err := neo4jDriver1.Session(neo4j.AccessModeWrite)
	if err != nil {
		return false, err
	}
	defer session.Close()

	validation, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		// quering db
		result, err := transaction.Run(
			"MATCH (n:User { email:$email}) return n",
			map[string]interface{}{"email": email})
		if err != nil {
			return nil, err
		}

		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}

		return nil, result.Err()
	})

	// TODO: super dirty - clean up - bascially for empty results in validation, its "<nil>" orther are like mem addresses or someshit
	return len(fmt.Sprintf("%v", validation)) > 5, nil
}

func checkEmail(c *gin.Context) {

	type Email struct {
		Email string
	}
	var json Email

	// check json and populate it if its iight
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// verify user in DB
	if result, err := checkEmailExists(json.Email); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}) // db error
		return
	} else if result {
		c.JSON(http.StatusNotAcceptable, gin.H{"status": "email already exists"}) // user or pass dont match
		return
	}

	// everything worked!
	c.JSON(http.StatusOK, gin.H{"status": "email valid"})
}

func creatAccountInDB(FirstName string, LastName string, Phone string, Email string, Password string, Birthday string) (bool, error) {
	// session set up
	session, err := neo4jDriver1.Session(neo4j.AccessModeWrite)
	if err != nil {
		return false, err
	}
	defer session.Close()

	validation, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		// quering db
		result, err := transaction.Run(
			"CREATE (n:User { firstName:$firstname, lastName:$lastname, phone:$phone, email:$email, password:$password, birthday:$birthday }) return n",
			map[string]interface{}{"firstname": FirstName, "lastname": LastName, "phone": Phone, "email": Email, "password": Password, "birthday": Birthday})
		if err != nil {
			return nil, err
		}

		if result.Next() {
			return result.Record().GetByIndex(0), nil
		}

		return nil, result.Err()
	})

	// TODO: super dirty - clean up - bascially for empty results in validation, its "<nil>" orther are like mem addresses or someshit
	return len(fmt.Sprintf("%v", validation)) > 5, nil
}

func createUserAccount(c *gin.Context) {
	//firstName, lastName, phone, email, password, birthday
	type User struct {
		FirstName string
		LastName  string
		Phone     string
		Email     string
		Password  string
		Birthday  string
	}
	var json User

	// check json and populate it if its iight
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// verify user in DB
	if result, err := creatAccountInDB(json.FirstName, json.LastName, json.Phone, json.Email, json.Password, json.Birthday); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}) // db error
		return
	} else if !result {
		c.JSON(http.StatusNotAcceptable, gin.H{"status": "account not created"}) // user or pass dont match
		return
	}

	// everything worked!
	c.JSON(http.StatusOK, gin.H{"status": "account created"})
}

// SetUpSignUp sets up signup
func SetUpSignUp(server *gin.Engine, driver neo4j.Driver) {
	neo4jDriver1 = driver
	setSignUpDBConstraint()
	// endpoints
	server.POST("/checkEmailExists", checkEmail)
	server.POST("/createUserAccount", createUserAccount)
}
