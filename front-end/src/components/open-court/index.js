import React, { Component } from "react";
import {withStyles} from "@material-ui/core/styles";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import UploadPost from "./uploadPost"
import Post from './post'
import {uid} from "react-uid";
import {fetchUserProfilePic} from '../../service/ProfileService'
const styles = theme =>({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
      },
});
const LOADPOSTS = '/allPosts'
export class openCourt extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            "firstName":"",
            "lastName":"",
            posts: [],
            loading:true,
            profileLink:"",
        };
        this.reloadPost = this.reloadPost.bind(this)
    }
    componentDidMount(){
        this.reloadPost()
        
    }
    componentDidUpdate(prevProps, prevState){
        if(this.state.firstName.length == 0){
            this.getUserName()
            this.getUserProfilePic()  
        }

    
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
            .then((data) => (this.setState({posts: data, loading:false})))
            .catch(err => console.log(err))
      }

      async getUserProfilePic(){
        const result = await fetchUserProfilePic(this.props.user.email)
        this.setState({profileLink: result})
      }
    getUserName(){
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


    render(){
        const firstName =this.state.firstName;
        const lastName = this.state.lastName;
        const {user, classes} = this.props;
        return(
            <div>
            <div>
                <UploadPost user={user} firstName={firstName} lastName={lastName} profileLink={this.state.profileLink} component ={this}/>
                
                {this.state.loading
                ? <CircularProgress
                    size="4rem"
                    style={{ position: "fixed", top: "50%", left: "50%" }}
                    />
                :
                <>{this.state.posts.map(post =>
                    <Post
                        key={uid(post)}
                        postInfo={post}
                        userId={user.email}
                        component={this}
                    />
                )}</>
            }
             </div>
            </div>
                    
    
                    
                        
                
            
        );
    }
}
export default withStyles(styles)(openCourt);
