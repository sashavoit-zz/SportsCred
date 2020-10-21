package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
)

var neo4jDriver neo4j.Driver // used in all db related funcs

var secertSigningKey = []byte("sercetkey")

func generateJWT(username string, password string) (string, error) {
	// make new token
	token := jwt.New(jwt.SigningMethodHS256)

	// populate data fields in token
	claims := token.Claims.(jwt.MapClaims)
	claims["authorized"] = true
	claims["username"] = username
	claims["password"] = password
	claims["exp"] = time.Now().Add(time.Minute + 300).Unix()

	// encrypt that shit
	tokenString, err := token.SignedString(secertSigningKey)
	if err != nil {
		fmt.Errorf("Error: %s", err.Error())
		return "", err
	}

	return tokenString, nil
}

func checkAuthToken(endpoint func(*gin.Context, string)) func(c *gin.Context) {
	// get token from header
	return func(c *gin.Context) {

		authTokens := c.Request.Header["Token"]

		if len(authTokens) > 0 {
			// check if token in header is valid
			token, err := jwt.Parse(authTokens[0],
				func(token *jwt.Token) (interface{}, error) {
					if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
						return nil, fmt.Errorf("JWT Token aint right")
					}
					return secertSigningKey, nil
				})

			// invalid token
			if err != nil {
				c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized 1"}) // token is wrong/old
				return
			}

			if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
				endpoint(c, claims["username"].(string)) // calling endpoint w username
			} else {
				c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized 3"}) // token is wrong/old
				return
			}

		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"status": "put some auth creds next time"})
			return
		}
	}
}

// TODO: move to DB
func checkUserCreds(username string, password string) (bool, error) {
	// session set up
	session, err := neo4jDriver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return false, err
	}
	defer session.Close()

	validation, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		// quering db
		result, err := transaction.Run(
			"MATCH (n:User { username:$username, password:$password }) return n",
			map[string]interface{}{"username": username, "password": password})
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

// TODO: move to DB
func checkEmailExists(email string) (bool, error) {
	// session set up
	session, err := neo4jDriver.Session(neo4j.AccessModeWrite)
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

func authorizeUser(c *gin.Context) {

	type Login struct {
		UserName string
		Password string
	}
	var json Login

	// check json and populate it if its iight
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// verify user in DB
	if result, err := checkUserCreds(json.UserName, json.Password); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}) // db error
		return
	} else if !result {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "auth creds aint right"}) // user or pass dont match
		return
	}

	// make jwt
	token, err := generateJWT(json.UserName, json.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}) // server error
		return
	}

	// everything worked!
	c.JSON(http.StatusOK, gin.H{"token": token})
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
	session, err := neo4jDriver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return false, err
	}
	defer session.Close()

	validation, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		// quering db
		result, err := transaction.Run(
			"CREATE (n:User { firstname:$firstname, lastname:$lastname, phone:$phone, email:$email, password:$password, birthday:$birthday }) return n",
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

func getUser(c *gin.Context, username string) {
	c.JSON(http.StatusOK, gin.H{"username": username})
}

func main() {
	// neo4j driver setup
	const URI = "bolt://localhost:11003"
	const DBNAME = "neo4j"
	const DBPASS = "1234"
	const ENCRYPTED = false

	var err error
	neo4jDriver, err = neo4j.NewDriver(URI, neo4j.BasicAuth(DBNAME, DBPASS, ""), func(c *neo4j.Config) {
		c.Encrypted = ENCRYPTED
	})
	if err != nil {
		fmt.Println("DB couldnt start")
	}
	defer neo4jDriver.Close()

	// server w default stuff like logger and error handlers
	server := gin.Default()

	// endpoints
	server.POST("/login", authorizeUser)
	server.POST("/checkEmailExists", checkEmail)
	server.POST("/createUserAccount", createUserAccount)
	server.GET("/get-user", checkAuthToken(getUser)) // protected routes

	// start server
	server.Run(":8080")
}
