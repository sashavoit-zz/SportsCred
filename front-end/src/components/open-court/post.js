import React from 'react';
import {CardActions,Card, CardHeader,CardContent, Typography, IconButton,Avatar,Link, CardActionArea} from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ShareIcon from '@material-ui/icons/Share';
import { withStyles } from "@material-ui/core/styles";
import CommentIcon from '@material-ui/icons/Comment';

const userStyles = theme =>({
    root:{
        width: "60vw",
        marginBottom:10,
        marginTop: 10,
        marginLeft:"auto",
        marginRight:"auto"
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
        hover:{
            color:"green"
        }
    },


});

export class Post extends React.Component{
    componentDidMount () {
        const script = document.createElement("script");
    
        script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2";
        script.async = true;
        script.defer = true;
    
        document.body.appendChild(script);
    }
    render(){
        const {postInfo} = this.props;
        // const classes = userStyles();
        const {classes} = this.props;
        const url = postInfo.content.match(/\bhttps?:\/\/\S+/gi)
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
                        {url == null
                        ?<Typography variant ="body1" color="textSecondary">
                            {postInfo.content}
                        </Typography>
                        :<div>
                            <Typography variant ="body1" color="textSecondary">
                                {postInfo.content.split(url)}
                                <Link href={url} className = {classes.url}>
                                {url} 
                                </Link>
                                <Card className = {classes.card}>
                                    <CardActionArea >
                                    <CardContent className = {classes.embeds}>
                                    <div class="fb-post" 
                                        data-href={url}
                                        href = {url}
                                        data-width="500">
                                    </div>
                                    </CardContent>
                                    </CardActionArea>
                                    </Card>
                            </Typography>
                         
                        </div>
                        }
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