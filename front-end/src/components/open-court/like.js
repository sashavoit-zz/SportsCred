import React from 'react';
import {CardActions,Card, CardHeader,CardContent, Typography, IconButton,Avatar} from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ShareIcon from '@material-ui/icons/Share';
import { withStyles } from "@material-ui/core/styles";
import CommentIcon from '@material-ui/icons/Comment';

const url = 'http://localhost:3001/';

class Rate extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            countLikes: 0,
            totalLikes: parseInt(this.props.likes),
            countDislikes: 0,
            totalDislikes: parseInt(this.props.dislikes)
        };
    }

    handleLike = (e) => {
        e.preventDefault();
        this.updateLikes();
        this.reqLike();
    }

    handleDislike = (e) => {
        e.preventDefault();
        this.updateDislikes();
        this.reqDislike();
    }

    updateLikes = () =>{
        console.log('updating likes');
        if(this.state.countLikes == 0){
            this.setState({countLikes: 1, countDislikes: 0}, () => {this.updateTotal()});
        }
        else{
            this.setState({countLikes: 0, countDislikes: 0}, () => {this.updateTotal()});
       }
    }
    updateDislikes = () => {
        console.log('updating dislikes');
        if(this.state.countDislikes == 0){
            this.setState({countDislikes: 1, countLikes: 0}, () => {this.updateTotal()});
        }
        else{
            this.setState({countDislikes: 0, countLikes: 0}, () => {this.updateTotal()});
        }
    }
    updateTotal = () => {
        console.log(this.state);
        this.setState({totalLikes: this.state.countLikes + parseInt(this.props.likes)});
        this.setState({totalDislikes: this.state.countDislikes + parseInt(this.props.dislikes)});
    }

    componentDidMount = () => {
        this.updateTotal();
        console.log(this.state);
    }
    //posts/userid/like/postid
    reqLike = async () => {
        var likeurl = url+'posts/'+this.props.user+'/like/'+this.props.id;
        const req = new Request(likeurl, {
            method:'PUT'
        });
        fetch(req)
    }
    //posts/userid/dislike/postid
    reqDislike = async () => {
        var dislikeurl = url+'posts/'+this.props.user+'/dislike/'+this.props.id;
        const req = new Request(dislikeurl, {
            method:'PUT'
        });
        fetch(req)
    }

    render(){
        return(
            <div>
            <IconButton onClick={this.handleLike}>
                <ThumbUpAltIcon/>
                <Typography color="textSecondary">{this.state.totalLikes}</Typography>
            </IconButton>
            <IconButton onClick={this.handleDislike}>
                <ThumbDownAltIcon/>
                <Typography color="textSecondary">{this.state.totalDislikes}</Typography>
            </IconButton>
            </div>
        )
    }
}

export default Rate;