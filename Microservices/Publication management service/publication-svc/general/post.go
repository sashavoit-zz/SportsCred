package general

type Post struct {
	Content string
	Author string
	AuthorProfile string
	Likes int
	Dislikes int
	PostTime string
}

func NewPost(content string, author string, authorProfile string,
	likes int, dislikes int, postTime string) *Post {

	p:= Post{
		Content: content,
		Author: author,
		AuthorProfile: authorProfile,
		Likes: likes,
		Dislikes: dislikes,
		PostTime: postTime,
	}

	return &p
}
