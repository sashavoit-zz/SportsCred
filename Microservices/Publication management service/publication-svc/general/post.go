package general

type Post struct {
	Content string `json:"content"`
	UserId string `json:"userId"`
	PostId string `json:"postId"`
	Likes string `json:"likes"`
	Dislikes string `json:"dislikes"`
	Time string `json:"time"`
}

func NewPost(content string, userId string, postId string,
	likes string, dislikes string, time string) *Post {

	p:= Post{
		Content: content,
		UserId: userId,
		PostId: postId,
		Likes: likes,
		Dislikes: dislikes,
		Time: time,
	}

	return &p
}
