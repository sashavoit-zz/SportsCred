import React from "react";
import Post from "./post";
import {uid} from "react-uid";
import { withStyles } from "@material-ui/core/styles";

const LOADPOSTS = '/allPosts'

const userStyles = theme =>({
    root:{
        marginTop:'100px'
    },
});

export class feed extends React.Component{
    /* TODO:the posts in the state should fetch from the db, here are some dummy data */

    constructor(props) {
        super(props);
        this.state = {
            posts: []
        };
    }

    componentDidMount(){
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Token": localStorage.getItem("Token"),
            },
        };
        fetch(LOADPOSTS, requestOptions)
            .then(response => response.json())
            .then((data) => (this.setState({posts: data})))
            .catch(err => console.log(err))
    }

    render(){
        const {classes} = this.props;
        return(
            <div className =  {classes.root}>
                {this.state.posts.map(post =>
                    <Post
                        key={uid(post)}
                        postInfo={post}
                    />
                )}
            </div>
        );
    }
}
export default withStyles(userStyles)(feed);