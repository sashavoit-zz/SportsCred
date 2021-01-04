import React from 'react';
import {CardActions,Card, CardHeader,CardContent, Typography, IconButton,Avatar} from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import { withStyles } from "@material-ui/core/styles";
import CommentIcon from '@material-ui/icons/Comment';

import {TextField} from '@material-ui/core'
import Rate from "./Like";

const userStyles = theme =>({
    root:{
        width: "60vw",
        marginBottom:10,
        marginTop: 10,
        marginLeft:"auto",
        marginRight:"auto"
    },
});

export class Comment extends React.Component{
    constructor(props) {
        super(props);
        console.log(props);
    }

    render(){
        const {userId} = this.props;
        console.log(userId);
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
                        title={postInfo.firstName + " " + postInfo.lastName}
                        subheader = {postInfo.time}
                    >
                    </CardHeader> 
                    <CardContent>
                        <Typography variant ="body1" color="textSecondary">
                            {postInfo.content}
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <Rate type={"comments"} likes={postInfo.likes} dislikes={postInfo.dislikes} id={postInfo.postId} user={userId}></Rate>
                        <IconButton>
                            {/**TODO: onlick to reply the post */}
                            <TextField
                                placeholder="Leave a reply"
                                multiline
                                rows={2}
                                rowsMax={4}
                                />
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
export default withStyles(userStyles)(Comment);