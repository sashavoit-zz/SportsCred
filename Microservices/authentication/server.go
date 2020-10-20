package main

import (
	"fmt"

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


func main() {
	// neo4j driver setup
	const URI = "bolt://localhost:7687"
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
	server.GET("/get-user", checkAuthToken(getUser)) // protected routes

	// start server
	server.Run(":8080")
}
