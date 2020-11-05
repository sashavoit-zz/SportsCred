import React from 'react';
import {CardActions,Card, CardHeader,CardContent, Typography, IconButton,Avatar} from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ShareIcon from '@material-ui/icons/Share';
import { withStyles } from "@material-ui/core/styles";
import CommentIcon from '@material-ui/icons/Comment';
<<<<<<< HEAD
import Rate from "./like";
import {TextField} from '@material-ui/core'
import Comment from "./comment";
import { uid } from 'react-uid';

const REPLIES = '/postReply/'


=======
//import { useH } from "react-router-dom/cjs/react-router-dom.min";
import { Link } from 'react-router-dom'
>>>>>>> CSGAN-15

const userStyles = theme =>({
    root:{
        width: "60vw",
        marginBottom:10,
        marginTop: 10,
        marginLeft:"auto",
        marginRight:"auto"
    },
});

// handleOnSubmit = () => {
//     this.props.history.push(`/dashboard`);
// };

export class Post extends React.Component{
    constructor(props) {
        super(props);
        console.log("post contrtruct");
        console.log(props);
        this.state = {
            uploadInput:"",
            errorText:"",
            firstName:"",
            lastName:"",
            replies: []
        }
    }

    addComment = async (content, author, commentTime) => {
        const response = fetch('/reply/'+this.props.postInfo.postId+"/hashasdasd", {
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify({
                "content":content,
                "email": author,
                "likes":0,
                "dislikes":0,
                "commentTime":commentTime
            }),
            headers: {
                "Content-Type": "application/json",
                "Token": localStorage.getItem("Token"),
              },
        });
    }

    componentDidMount(){
        this.refresh();
    }



    refresh = () => {
                const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Token": localStorage.getItem("Token"),
            },
        };
        fetch(REPLIES+this.props.postInfo.postId, requestOptions)
            .then(response => response.json())
            .then((data) => (this.setState({replies: data})))
            .catch(err => console.log(err))
    }
    

    render(){
<<<<<<< HEAD
        const {userId} = this.props;
        console.log(userId);
=======
        //let history = useH();
>>>>>>> CSGAN-15
        const {postInfo} = this.props;
        // const classes = userStyles();
        console.log(postInfo)
        const {classes} = this.props;

        const handleInput=(field)=>{
            const value = field.value;
            const name = field.name;
            this.setState({
                [name]:value
            })
        }
        const handleSubmit = () =>{
            if(this.state.uploadInput.length === 0){
                /*handling if user uploading post with empty content, will occur error message*/
                handleInputEmpty();
            }
            else{
                const today = new Date();
                const date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
                this.addComment(this.state.uploadInput,userId,date)
                reset()
            }
        }
        const reset = () =>{
            this.setState({
                uploadInput:"",
                errorText:""
            }, () => {this.refresh();})
        }
        const handleInputEmpty = ()=>{
           this.setState({
               errorText:"Could not upload comment with empty content"
           })
        }
        console.log("in post class");
        console.log(postInfo.likes);

        return (
            <div>
                <Card className={classes.root}>
                    <Link to={"/the-zone/" + postInfo.postId}> 
                        <CardHeader
                            //avatar={
                            //    <Avatar src ={postInfo.AuthorProfile}/>
                            //}
                            //onClick={() => history.push("/the-zone/" + postInfo.postId)}
                            title={postInfo.firstName + " " + postInfo.lastName}
                            subheader = {postInfo.time}
                            >
                            
                        </CardHeader>
                    </Link>
                    <CardContent>
                        <Typography variant ="body1" color="textSecondary">
                            {postInfo.content}
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <Rate type={"posts"} likes={postInfo.likes} dislikes={postInfo.dislikes} id={postInfo.postId} user={userId}></Rate>
                        <TextField
                                error ={this.state.errorText.length === 0 ? false : true }
                                placeholder="Leave a reply"
                                id = "standard-multiline-static"
                                multiline
                                onChange={e => handleInput(e.target)}
                                InputProps={
                                    {className: classes.input}
                                }
                                helperText={this.state.errorText}
                                name = "uploadInput"
                                rows={2}
                                rowsMax={4}
                        />
                        <IconButton onClick={e=>handleSubmit()}>
                            {/**TODO: onlick to reply the post */}
                            <CommentIcon/>
                        </IconButton>
                        <IconButton>
                            {/**TODO: onlick to reply the post */}
                            <ShareIcon/>
                        </IconButton>
                    </CardActions>
                    
                    <div className={classes.root} style={{"marginLeft":"25px","marginTop":"10px"}}>
                        {this.state.replies.map(reply =>
                            <Comment   
                                key={uid(reply)}
                                userId={userId}
                                postInfo={reply}
                            />
                        )}
                    </div>
                    
                </Card>
            </div>
        )
    }

}
export default withStyles(userStyles)(Post);


// render(){
//     const {classes} = this.props;
//     const {user} = this.props;
//     console.log("render of feed");
//     console.log(user);
//     return(
//         <div className =  {classes.root}>
//             {this.state.posts.map(post =>
//                 <Post
//                     key={uid(post)}
//                     postInfo={post}
//                     userId={user.email}
//                 />
//             )}
//         </div>
//     );
// }