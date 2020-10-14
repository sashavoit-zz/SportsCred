package handlers

import (
	"encoding/json"
	//"encoding/json"
	"net/http"
	"publication-svc/general"
)

func LoadPosts(w http.ResponseWriter, r *http.Request) {

	//This will fetch posts from the database once it's ready

	const number_of_posts int = 2

	post1 := general.NewPost("mockcontent1", "mockauthor1",
		"https://google.com", 100, 590)
	post2 := general.NewPost("mockcontent2", "mockauthor2",
		"https://google.com", 200, 666)


	posts := []*general.Post {
		post1,
		post2,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(posts)

}
