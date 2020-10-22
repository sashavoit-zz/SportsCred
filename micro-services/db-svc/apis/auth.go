package apis

import (
	"fmt"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/neo4j/neo4j-go-driver/neo4j"
)

var neo4jDriver neo4j.Driver // used in all db related funcs

var secertSigningKey = []byte("fuck-is-wrong-with-docs-for-golang")

func generateJWT(email string, password string) (string, error) {
	// make new token
	token := jwt.New(jwt.SigningMethodHS256)

	// populate data fields in token
	claims := token.Claims.(jwt.MapClaims)
	claims["authorized"] = true
	claims["email"] = email
	claims["exp"] = time.Now().Add(time.Minute * 30).Unix()

	// encrypt that shit
	tokenString, err := token.SignedString(secertSigningKey)
	if err != nil {
		fmt.Errorf("Error: %s", err.Error())
		return "", err
	}

	return tokenString, nil
}

// This is the function that should be wrapped around other endpoints
func CheckAuthToken(endpoint func(*gin.Context, string)) func(c *gin.Context) {
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
				fmt.Println(err.Error())
				c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized 1"}) // token is wrong/old
				return
			}

			if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
				endpoint(c, claims["email"].(string)) // calling endpoint w username
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
func checkUserCreds(email string, password string) (bool, error) {
	// session set up
	session, err := neo4jDriver.Session(neo4j.AccessModeWrite)
	if err != nil {
		return false, err
	}
	defer session.Close()

	validation, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		// quering db
		result, err := transaction.Run(
			"MATCH (n:User { email:$email, password:$password }) return n",
			map[string]interface{}{"email": email, "password": password})
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
		Email    string
		Password string
	}
	var json Login

	// check json and populate it if its iight
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// verify user in DB
	if result, err := checkUserCreds(json.Email, json.Password); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}) // db error
		return
	} else if !result {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "auth creds aint right"}) // user or pass dont match
		return
	}

	// make jwt
	token, err := generateJWT(json.Email, json.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}) // server error
		return
	}

	// everything worked!
	c.JSON(http.StatusOK, gin.H{"token": token})
}

func getUser(c *gin.Context, email string) {
	c.JSON(http.StatusOK, gin.H{"email": email})
}

func SetUpAuth(server *gin.Engine, driver neo4j.Driver) {
	neo4jDriver = driver
	// endpoints
	server.POST("/login", authorizeUser)
	server.GET("/get-user", CheckAuthToken(getUser)) // protected routes
}
