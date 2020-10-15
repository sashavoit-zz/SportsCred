package main

import (
	"log"
	"net/http"
	"github.com/go-chi/chi"
	"publication-svc/handlers"
)

func registerRoutes() http.Handler{
	router := chi.NewRouter()

	router.Route("/openCourt", func(router chi.Router) {
		router.Get("/loadPosts", handlers.LoadPosts)
	})

	return router
}

func main(){
	router := registerRoutes()
	log.Fatal(http.ListenAndServe(":8080", router))
}
