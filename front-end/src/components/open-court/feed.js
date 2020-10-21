import React from "react";
import Post from "./post";
import {uid} from "react-uid";

const ENDPOINT = 'http://localhost:8081/openCourt'
const LOADPOSTS = '/loadPosts'

export class feed extends React.Component{
    /* TODO:the posts in the state should fetch from the db, here are some dummy data */

    constructor(props) {
        super(props);
        this.state = {
            posts: []
        };
    }

    componentDidMount(){
        fetch(ENDPOINT + LOADPOSTS)
            .then(response => response.json())
            .then((data) => (this.setState({posts: data})))
    }

    render(){
        return(
            <div>
                {this.state.posts.map(post =>
                    <Post
                        key={uid(post)}
                        postInfo = {post}
                    />
                )}
            </div>
        );
    }
}
export default feed;