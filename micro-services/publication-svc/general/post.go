package general

type Post struct {
	Content string `json:"content"`
	FirstName string `json:"firstName"`
	LastName string `json:"lastName"`
	Likes string `json:"likes"`
	Dislikes string `json:"dislikes"`
	PostTime string `json:"postTime"`
}

func NewPost(content string, firstName string, lastName string,
	likes string, dislikes string, postTime string) *Post {

	p:= Post{
		Content: content,
		FirstName: firstName,
		LastName: lastName,
		Likes: likes,
		Dislikes: dislikes,
		PostTime: postTime,
	}

	return &p
}
