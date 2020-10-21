package main

import (
	"net/http"
	"net/http/httputil"

	"github.com/gin-gonic/gin"
)

func reverseProxy(target string) gin.HandlerFunc {
	return func(c *gin.Context) {
		director := func(req *http.Request) {
			req.URL.Scheme = "http"
			req.URL.Host = target
			req.Header["my-header"] = []string{req.Header.Get("my-header")}
			// Golang camelcases headers
			delete(req.Header, "My-Header")
		}
		proxy := &httputil.ReverseProxy{Director: director}
		proxy.ServeHTTP(c.Writer, c.Request)
	}
}

func main() {
	// TODO: move these constants to somewhere else
	const authServer = "localhost:8080"
	const openCourt = "localhost:8082"

	// server w default stuff like logger and error handlers
	server := gin.Default()

	// endpoints - for auth
	server.POST("/login", reverseProxy(authServer))
	server.GET("/get-user", reverseProxy(authServer)) // protected routes
	server.GET("/openCourt/loadPosts", reverseProxy(openCourt))

	// start server
	server.Run(":8081")
}
