import React, { Component } from "react";
import UploadPost from "./uploadPost"
import Post from './post'
import {uid} from "react-uid";

const LOADPOSTS = '/allPosts'
export class openCourt extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            "firstName":"",
            "lastName":"",
            reload:true,
            posts: []
        };
        this.reloadPost = this.reloadPost.bind(this)
        this.checkonClick = this.checkonClick.bind(this)
    }
    componentDidMount(){
        this.reloadPost()
    }
    componentDidUpdate(prevProps, prevState){
        if(this.state.firstName.length == 0){
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Token": localStorage.getItem("Token"), 
                },
            };
            fetch("/getUserName/"+this.props.user.email,requestOptions)
                .then(response => response.json())
                .then((data) => {
                    this.setState({
                            firstName:data.firstName,
                            lastName:data.lastName
                    })
                })
                .catch(err => console.log(err))     
        }
        if(prevState.reload !== this.state.reload){
            this.reloadPost()
        }

    
    }
    checkonClick(){
        const reload = !this.state.reload
        this.setState({reload:reload})
    }
    reloadPost() {
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
        const firstName =this.state.firstName;
        const lastName = this.state.lastName;
        const {user} = this.props;
        return(
            <div>
            <UploadPost user={user} firstName={firstName} lastName={lastName} reload={this.checkonClick}/>
            {this.state.posts.map(post =>
                    <Post
                        key={uid(post)}
                        postInfo={post}
                        userId={user.email}
                    />
                )}
            </div>
        );
    }
}
export default openCourt;
