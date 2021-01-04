import React from 'react';

import {CardActions,Card, Grid,CardContent, Typography, IconButton,Avatar, CardActionArea,GridList,GridListTile, ButtonBase} from '@material-ui/core';
import FacebookEmbeds from './FacebookEmbeds';
import RedditEmbeds from './RedditEmbeds';
import InstagramEmbeds from './InstagramEmbeds';

import { withStyles } from "@material-ui/core/styles";
import CommentIcon from '@material-ui/icons/Comment';
import Rate from "./Like";

import PropTypes from 'prop-types';

import ShareMenu from '../post/ShareMenu';
import PostComment from '../post/PostComment';

import {Box, Divider } from "@material-ui/core";

import LaunchIcon from '@material-ui/icons/Launch';

import { Button, Form } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const styles = theme => ({
    root: {
        backgroundColor: "#424242"
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
        marginTop: "60px",
        width: "100%",
    },
    card:{
        width:'90%',
        marginTop:'15px',
        marginLeft:'3%',
        borderLeftWidth: "5px",
        borderLeftStyle: "solid",
        borderLeftColor: theme.palette.primary.main,
    },
    embeds:{
        backgroundColor: "#ffffff",
    },
    url:{
        color:"#424242",
    },
    imageGrid:{
        maxHeight:'100%',
        maxWidth:'100%',
        height:"auto",
        width:"auto"
    },
    cardRoot: {
        overflow: "hidden",
        backgroundColor: "#424242",
        paddingBottom: "15px",
    },
    userIcon: {
        float: "left",
        margin: "12px",
        width: theme.spacing(7),
        height: theme.spacing(7),
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
        fontSize: "20px"
    },
    postInfo: {
        color: "#909090",
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
    },
    gridList: {
        maxHeight: 500,
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
      },
 
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
            errorText: "Add reply to this post",
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
                "commentTime":commentTime
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
            this.setState({ commtData: commts })
            this.props.component.setState({loading:false})
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
                errorText: "comment send."
            }, () => { this.refresh(); })
            replyFiel.value = ""
            this.setState({commtData: this.state.commtData})
        }
    }

    



    componentDidMount() {
        this.refresh();
    }

    highlightPattern = (text, pattern) => {
        const splitText = text.split(pattern);
      
        if (splitText.length <= 1) {
          return text;
        }
      
        const matches = text.match(pattern);
      
        return splitText.reduce((arr, element, index) => (matches[index] ? [
          ...arr,
          element,
          <Typography variant= "h5" color="primary" display="inline">
            {matches[index]}
          </Typography>,
        ] : [...arr, element]), []);
      };
    
    render(){
        const { classes } = this.props;
        const {userId} = this.props;
        const {postInfo, component} = this.props;
        const url = postInfo.content.match(/\bhttps?:\/\/\S+/gi)
        const hash =/(?:\s|^)?#[A-Za-z0-9\-\.\_]+(?:\s|$)/g
    
        return (
            <div className={classes.cardArea}>
                <Card className={classes.cardRoot} variant="outlined">
                    <Link to={postInfo.email == localStorage.getItem("User") ? "/profile" : "/user/" + postInfo.email }>
                    <a>
                        <Avatar className={classes.userIcon} src={postInfo.profilePic}/>
                    </a>
                    </Link>
                    <CardContent className={classes.cardContent}>
                        <div className={classes.cardName}>
                            <Link to={postInfo.email == localStorage.getItem("User") ? "/profile" : "/user/" + postInfo.email}>
                            <a>
                                <Box style={{ fontWeight: "bold" }} display='inline'>
                                    {postInfo.firstName + " " + postInfo.lastName + "   "}
                                </Box>
                            </a>
                            </Link>
                            <Box className={classes.postInfo} display='inline'>
                                {"ACS: " + postInfo.acs + " - " + postInfo.email + " - " + timeSince(postInfo.time)}
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
                        ?<div>
                        <Typography variant ="h5" color="white" style={{ wordWrap: "break-word" }}>
                            {this.highlightPattern(postInfo.content, hash)}
                        </Typography>
                        {postInfo.pics == null
                        ?<div></div>
                        :
                        <div>
                        <div style={{ marginTop:"10px"}}></div>
                        <GridList cellHeight="auto" spacing={3} className={classes.gridList} cols={2}>
                            {
                            postInfo.pics.map(imageURL => (
                            <GridListTile cols={1} >
                                    <img  src={imageURL} className={classes.imageGrid}/>
                            </GridListTile>
                            ))}
                        </GridList>
                        </div>

                        }
                        </div>
                        :<Typography color="white">
                            <Typography variant ="h5" style={{ wordWrap: "break-word" }}>
                                {this.highlightPattern(postInfo.content.split(url)[0], hash)}
                            <Typography>
                                {this.highlightPattern(postInfo.content.split(url)[1], hash)}
                            </Typography>
                        </Typography>
                            <Card className = {classes.card}>
                                <CardActionArea >
                                <CardContent className = {classes.embeds}>
                                    {
                                        {
                                            'facebook':<FacebookEmbeds url={url}/>,
                                            'reddit':<RedditEmbeds url = {url}/>,
                                            'instagram':<InstagramEmbeds url={url}/>
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
                            <Form id="fm" onSubmit={this.handleSubmit} reply style={{ color: "#ff9800", marginTop: "15px" }}>
                                <Form.TextArea
                                        placeholder={this.state.errorText}
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

