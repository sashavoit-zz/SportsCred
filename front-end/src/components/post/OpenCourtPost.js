import React from "react";
import Post from "../open-court/Post";
import { uid } from "react-uid";
import { withStyles } from "@material-ui/core/styles";

const LOADPOSTS = '/allPosts'

const userStyles = theme => ({
  root: {
    marginTop: '100px'
  },
});

export class OpenCourtPost extends React.Component {
  /* TODO:the posts in the state should fetch from the db, here are some dummy data */

  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    const user_url = '/post/' + this.props.param;
    console.log("open court did mount");
    console.log(this.props.param);
    console.log(this.props);
    const user_request = new Request(user_url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Token': localStorage.getItem("Token")
      }
    });
    fetch(user_request)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          console.log('could not get post');
        }
      })
      .then(data => {
        this.setState({
          posts: data
        })
      })
      .catch((error) => {
        console.log(error)
      });
  }
  render() {
    const { classes } = this.props;
    const { user } = this.props;
    return (
      <div className={classes.root} style={{width:"50vw",margin:"auto"}}>
        {this.state.posts.map(post =>
          <Post
            key={uid(post)}
            postInfo={post}
            userId={user.email}
            isSingle={true}
          />
        )}
      </div>
    );
  }
}
export default withStyles(userStyles)(OpenCourtPost);