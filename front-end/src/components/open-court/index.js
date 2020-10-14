import React from "react";
import Post from "./post";
import {uid} from "react-uid";

export class openCourt extends React.Component{
    /* TODO:the posts in the state should fetch from the db, here are some dummy data */
    state = {
        posts:[
            {content:"mockcontent1mockcontent1", author:"mockauthor1", authorProfile: require("../../lib/profilePic.png"),likes:100, dislikes:29},
            {content:"mockcontent2mockcontent2", author:"mockauthor2", authorProfile: require("../../lib/profilePic.png"),likes:30, dislikes:9}
        ],
        /** TODO:The info of the currentUser should fetch from the db, here are some mock data */
        currentUser:{userName:"mockCurrentUser", email:"mock@gmail.com", profilePic:require("../../lib/profilePic.png")}
    };

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
export default openCourt;