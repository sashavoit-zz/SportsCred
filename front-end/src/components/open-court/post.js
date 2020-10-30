import React from 'react';
import {CardActions,Card, CardHeader,CardContent, Typography, IconButton,Avatar} from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ShareIcon from '@material-ui/icons/Share';
import { withStyles } from "@material-ui/core/styles";
import CommentIcon from '@material-ui/icons/Comment';
//import { useH } from "react-router-dom/cjs/react-router-dom.min";
import { Link } from 'react-router-dom'

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
    render(){
        //let history = useH();
        const {postInfo} = this.props;
        // const classes = userStyles();
        console.log(postInfo)
        const {classes} = this.props;
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
                        <IconButton>
                            <ThumbUpAltIcon/>
                            <Typography color="textSecondary">{postInfo.likes}</Typography>
                        </IconButton>
                        <IconButton>
                            <ThumbDownAltIcon/>
                            <Typography color="textSecondary">{postInfo.dislikes}</Typography>
                        </IconButton>
                        <IconButton>
                            {/**TODO: onlick to reply the post */}
                            <CommentIcon/>
                        </IconButton>
                        <IconButton>
                            {/**TODO: onlick to reply the post */}
                            <ShareIcon/>
                        </IconButton>
                    </CardActions>
                </Card>
            </div>
        )
    }

}
export default withStyles(userStyles)(Post);