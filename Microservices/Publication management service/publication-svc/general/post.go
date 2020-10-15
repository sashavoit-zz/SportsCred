package general

type Post struct {
	Content string
	Author string
	AuthorProfile string
	Likes int
	Dislikes int
}

func NewPost(content string, author string, authorProfile string, likes int, dislikes int) *Post {

	p:= Post{
		Content: content,
		Author: author,
		AuthorProfile: authorProfile,
		Likes: likes,
		Dislikes: dislikes,
	}

	return &p
}
