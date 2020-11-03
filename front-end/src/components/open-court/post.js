import React from 'react';
import {CardActions,Card, CardHeader,CardContent, Typography, IconButton,Avatar,Link, CardActionArea} from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ShareIcon from '@material-ui/icons/Share';
import { withStyles } from "@material-ui/core/styles";
import CommentIcon from '@material-ui/icons/Comment';
import FacebookEmbeds from './facebookEmbeds';
import TwitterEmbeds from './twitterEmbeds';
import RedditEmbeds from './redditEmbeds';
import InsEmbeds from './insEmbeds'; 

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
    },


});
function checkWebsite(url){
    const beforeCom = url.split(".com")[0];
    const lastIndex = beforeCom.split(/[./]+/).length-1;
    const web = beforeCom.split(/[./]+/)[lastIndex];
    return web
}


export class Post extends React.Component{
    render(){
        const {postInfo} = this.props;
        // const classes = userStyles();
        const {classes} = this.props;
        const url = postInfo.content.match(/\bhttps?:\/\/\S+/gi)
        return (
            <div>
                <Card className={classes.root}>
                    <CardHeader
                        avatar={
                           <Avatar src ={postInfo.AuthorProfile}/>
                        }
                        title={postInfo.firstName + " " + postInfo.lastName}
                        subheader = {postInfo.time}
                    >
                    </CardHeader> 
                    <CardContent>
                        {url == null
                        ?<Typography variant ="body1" color="textSecondary" style={{ wordWrap: "break-word" }}>
                            {postInfo.content}
                        </Typography>
                        :<Typography variant ="body1" color="textSecondary">
                            <Typography style={{ wordWrap: "break-word" }}>
                                {postInfo.content.split(url)[0]}
                            <Typography>
                                <Link href={url} className = {classes.url}>
                                    {url} 
                                </Link>
                            </Typography>
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
                                        }[checkWebsite(url)]
                                    }
                                
                                </CardContent>
                                </CardActionArea>
                                </Card>
                        </Typography>
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