import React from 'react';

import {CardActions,Card, CardHeader,CardContent, Typography, IconButton,Avatar, CardActionArea} from '@material-ui/core';
import FacebookEmbeds from './facebookEmbeds';
import TwitterEmbeds from './twitterEmbeds';
import RedditEmbeds from './redditEmbeds';
import InsEmbeds from './insEmbeds';

import ReactDOM from 'react-dom'
import { withStyles } from "@material-ui/core/styles";
import CommentIcon from '@material-ui/icons/Comment';
import Rate from "./like";

import PropTypes from 'prop-types';


import ShareMenu from '../post/ShareMenu';
import PostComment from '../post/PostComment';

import {Box, Divider } from "@material-ui/core";


import FaceIcon from '@material-ui/icons/Face';
import LaunchIcon from '@material-ui/icons/Launch';


import { Button, Form } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const log = console.log

const styles = theme => ({
    root: {
        backgroundColor: "#00000060"
        //width: "300px",
    },
    content: {
        overflow: "hidden", /* will contain if #first is longer than #second */
        paddingTop: "80px",
    },
    menu: {
        float: "left",
        //display: "inline-block",
        paddingTop: "20px",
        width: "30%",
        borderRight: "solid white",
        textAlign: "center",
    },
    option: {
        marginBottom: "30px"
    },

    profile: {
        overflow: "hidden",
        //height:"100%",
        //display: "inline-block",
    },
    leftProfile: {
        //marginLeft:"30px",
        //paddingTop: "40px",
        float: "left",
        width: "30%",
        textAlign: "center",

        //height:"100%",
        //display: "inline-block",
    },
    rightProfile: {
        overflow: "hidden",
        //height:"100%",
        //display: "inline-block",
    },
    bottomProfile: {
        //overflow: "hidden",
        position: "relative",
        //height:"100%",
        //display: "inline-block",
        textAlign: "center",
    },
    blueText: {
        color: "#0099ff",
        fontSize: "16px"
    },
    note: {
        color: "white",
        fontSize: "13px",
        // width:"50%",
        // textAlign: "center",
    },
    inputField: {
        //color: "white",
        backgroundColor: "transparent",
        color: "white",
        width: "50%",
        marginTop: "20px",
    },
    inputFieldShort: {
        //color: "white",
        backgroundColor: "transparent",
        color: "white",
        width: "24%",
        marginRight: "1%",
        marginLeft: "1%",
        marginTop: "20px",
    },
    submitButton: {
        marginTop: "20px",
        marginBottom: "20px",
        color: "white",
        backgroundColor: "#0066cc",
    },
    cancleButton: {
        marginTop: "20px",
        marginBottom: "20px",
        color: "white",
        backgroundColor: "#333333",
    },
    cardArea: {
        maxWidth: "600px",
        marginTop: "60px",
        marginLeft: "auto",
        marginRight: "auto",
        width: "60vw",
    },
    card:{
        width:'60%',
        marginTop:'15px',
        marginLeft:'3%',
        borderLeftWidth: "5px",
        borderLeftStyle: "solid",
        borderLeftColor:"#757ce8"
    },
    embeds:{
        backgroundColor: "#303030",  
    },
    url:{
        color:"#757ce8",
    },


    cardRoot: {
        overflow: "hidden",
        backgroundColor: "#00000060",
        paddingBottom: "15px"
    },
    userIcon: {
        float: "left",
        fontSize: "60px",
        margin: "12px"

    },
    launchIcon: {
        float: "right",
        //fontSize: "60px",
    },
    cardContent: {
        overflow: "hidden",
        paddingLeft: "0",
        "&:last-child": {
            paddingBottom: 0
        }
    },
    cardAction: {
        paddingLeft: "0",
    },
    cardName: {
        fontSize: "15px"
    },
    postInfo: {
        color: "#737373",
    },
    cardBody: {
        fontSize: "15px",
        marginTop: "15px",
        marginBottom: "15px",
    },
    iconButton: {
        padding: "0",
        marginLeft: "25%",
        //frontSize: "15"
    },
    contentDivider: {
        marginTop: "15px"
    },
    commentDivider: {
        marginBottom: "15px"
    }
});
function checkWebsite(url){
    const beforeCom = url.split(".com")[0];
    const lastIndex = beforeCom.split(/[./]+/).length-1;
    const web = beforeCom.split(/[./]+/)[lastIndex];
    return web
}

function timeConverter(UNIX_timestamp) {
    if (!UNIX_timestamp) {
        return null
    }
    const a = new Date(UNIX_timestamp)//.toLocaleDateString("en-US");
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    return date + ' ' + month + ' ' + year
}

function timeSince(UNIX_timestamp) {
    if (!UNIX_timestamp) {
        return null
    }
    //const a = //.toLocaleDateString("en-US")
    const timeStamp = new Date(UNIX_timestamp)
    const now = new Date(),
        secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
    if (secondsPast < 60) {
        return parseInt(secondsPast) + 's ago';
    }
    if (secondsPast < 3600) {
        return parseInt(secondsPast / 60) + 'm ago';
    }
    if (secondsPast <= 86400) {
        return parseInt(secondsPast / 3600) + 'h ago';
    }
    if (secondsPast > 86400) {
        const day = timeStamp.getDate();
        const month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
        const year = timeStamp.getFullYear() == now.getFullYear() ? "" : " " + timeStamp.getFullYear();
        return day + " " + month + year;
    }
}



export class Post extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            errorText:"",
            firstName:"",
            lastName:"",
            replies: [],
            url: "google.com",
            inputMode: false,
            commtData: []
        }
    }
    
    addComment = async (content, author, commentTime) => {
        fetch('/reply/'+this.props.postInfo.postId+"/hashasdasd", {
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify({
                "content":content,
                "email": author,
                "likes":0,
                "dislikes":0,
                "commentTime":commentTime,
                "email": localStorage.getItem("User")
            }),
            headers: {
                "Content-Type": "application/json",
                "Token": localStorage.getItem("Token"),
              },
        }).then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                console.log('could not post comments');
            }
        })
        .then(commts => {
            this.refresh()
        })
        .catch((error) => {
            console.log(error)
        });
    }

    refresh = () => {
        //const postId
        const url = '/postReply/' + this.props.postInfo.postId; 
        const comment_request = new Request(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Token': localStorage.getItem("Token") // move whole function to ApiCalls.js later
            }
        });
        fetch(comment_request)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                console.log('could not get post comments');
            }
        })
        .then(commts => {
            log("comments-------------------------99989989")
            log(commts)
            this.setState({ commtData: commts })
        })
        .catch((error) => {
            console.log(error)
        });
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const replyFiel = event.target.firstChild.firstChild
        const replyText = replyFiel.value
        if (replyText.length === 0) {
            /*handling if user uploading post with empty content, will occur error message*/
            this.setState({
                errorText: "Could not upload comment with empty content"
            })
        }
        else {
            const today = new Date();
            const date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
            this.addComment(replyText, this.props, date)
            this.setState({
                uploadInput: "",
                errorText: ""
            }, () => { this.refresh(); })
            replyFiel.value = ""
            replyFiel.placeholder = "comment send."
            log("befoer after")
            log(this.state.commtData)
            this.setState({commtData: this.state.commtData})
            log(this.state.commtData)
        }
    }

    



    componentDidMount() {
        this.refresh();
    }

    render(){
        const { classes } = this.props;
        const {userId} = this.props;
        const {postInfo} = this.props;
        const url = postInfo.content.match(/\bhttps?:\/\/\S+/gi)
    
        return (
            <div className={classes.cardArea}>
                <Card className={classes.cardRoot} variant="outlined">
                    <Avatar className={classes.userIcon} src ={postInfo.profilePic}/>
                    <CardContent className={classes.cardContent}>
                        <div className={classes.cardName}>
                            <Box style={{ fontWeight: "bold" }} display='inline'>
                                {postInfo.firstName + " " + postInfo.lastName + "   "}
                            </Box>
                            <Box className={classes.postInfo} display='inline'>
                                {userId + " - " + timeSince(postInfo.time)}
                            </Box>
                            {!this.props.isSingle ?
                                <Link to={"/the-zone/" + postInfo.postId}>
                                    <LaunchIcon className={classes.launchIcon}></LaunchIcon>
                                </Link>:
                                null
                            }
                            
                        </div>
                        <div className={classes.cardBody}>
                        {url == null
                        ?<Typography variant ="body1" color="textSecondary" style={{ wordWrap: "break-word" }}>
                            {postInfo.content}
                        </Typography>
                        :<Typography variant ="body1" color="textSecondary">
                            <Typography style={{ wordWrap: "break-word" }}>
                                {postInfo.content.split(url)[0]}
                            <Typography>
                                {postInfo.content.split(url)[1]}
                            </Typography>
                        </Typography>
                            <Card className = {classes.card}>
                                <CardActionArea >
                                <CardContent className = {classes.embeds}>
                                    {
                                        {
                                            'facebook':<FacebookEmbeds url={url}/>,
                                            'twitter':<TwitterEmbeds url = {url}/>,
                                            'reddit':<RedditEmbeds url = {url}/>,
                                            'instagram':<InsEmbeds url={url}/>
                                        }[checkWebsite(url[0])]
                                    }
                                
                                </CardContent>
                                </CardActionArea>
                                </Card>
                        </Typography>
                        }
                        <Divider className={classes.contentDivider}></Divider>
                        <CardActions className={classes.cardAction} disableSpacing>
                            <Rate type={"posts"} likes={postInfo.likes} dislikes={postInfo.dislikes} id={postInfo.postId} user={userId}></Rate>
                            <IconButton className={classes.iconButton} onClick={() => { this.setState({ inputMode: !this.state.inputMode }) }} >
                                {/**TODO: onlick to reply the post */}
                                <CommentIcon />
                            </IconButton>
                            <IconButton className={classes.iconButton} onClick={() => {console.log("this is thhe url"+this.state.url)}}>
                                {/**TODO: onlick to reply the post */}
                                <ShareMenu
                                    data={[this.state.url, postInfo.content, "#SportCred"]} //url, content, and hashtag
                                />
                            </IconButton>
                        </CardActions>
                        <Divider className={classes.commentDivider}></Divider>
                        <div id={"comm"+postInfo.postId}></div>
                        <PostComment data={this.state.commtData} />
                        {this.state.inputMode ?
                            <Form id="fm" onSubmit={this.handleSubmit} reply style={{ marginTop: "15px" }}>
                                <Form.TextArea
                                    placeholder="Add reply to this post"
                                />
                                <Button content='Add Reply' type="submit" labelPosition='left' icon='edit' primary />
                            </Form> : null
                        }
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

}
// export default withStyles(userStyles)(Post);
Post.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Post);

