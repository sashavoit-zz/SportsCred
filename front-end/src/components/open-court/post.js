import React from 'react';
import {CardActions,Card, CardHeader,CardContent, Typography, IconButton,Avatar} from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ShareIcon from '@material-ui/icons/Share';
import { withStyles } from "@material-ui/core/styles";
import CommentIcon from '@material-ui/icons/Comment';

const userStyles = theme =>({
    root:{
        width: "60vw",
        marginBottom:10,
        marginTop: 10
    },
});

export class Post extends React.Component{
    render(){
        const {postInfo} = this.props;
        // const classes = userStyles();
        const {classes} = this.props;
        return (
            <div>
                <Card className={classes.root}>
                    <CardHeader
                        //avatar={
                        //    <Avatar src ={postInfo.AuthorProfile}/>
                        //}
                        title={postInfo.firstName + postInfo.secondName}
                        subheader = {postInfo.time}
                    >
                    </CardHeader> 
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