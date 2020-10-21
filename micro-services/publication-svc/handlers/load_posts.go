package handlers

import (
	"encoding/json"
	"net/http"
	"publication-svc/general"
)

func LoadPosts(w http.ResponseWriter, r *http.Request) {

	//This will fetch posts from the database once it's ready
	resp, err := http.Get("http://localhost:3001/allPosts")
	if err!=nil{
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var posts []general.Post
	json.NewDecoder(resp.Body).Decode(&posts)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(posts)

}
