import React from 'react';
import { Typography, IconButton,Avatar} from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';

const url = '';

class Rate extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     countLikes: 0,
        //     totalLikes: parseInt(this.props.likes),
        //     countDislikes: 0,
        //     totalDislikes: parseInt(this.props.dislikes),
        //     deltaL: 0,
        //     deltaD: 0
        // };
        this.state = {
            likes: 0,
            dislikes: 0
        }
    }

    

    handleLike = (e) => {
        e.preventDefault();
        //this.updateLikes();
        this.reqLike();
        this.getLike();
        this.getDislike();
    }

    handleDislike = (e) => {
        e.preventDefault();
        //this.updateDislikes();
        this.reqDislike();
        this.getLike();
        this.getDislike();
    }

    // updateLikes = () =>{
    //     console.log('updating likes');
    //     if(this.state.countLikes == 0){
    //         this.setState({countLikes: 1, countDislikes: 0}, () => {this.updateTotal()});
    //     }
    //     else{
    //         this.setState({countLikes: 0, countDislikes: 0}, () => {this.updateTotal()});
    //    }
    // }
    // updateDislikes = () => {
    //     console.log('updating dislikes');
    //     if(this.state.countDislikes == 0){
    //         this.setState({countDislikes: 1, countLikes: 0}, () => {this.updateTotal()});
    //     }
    //     else{
    //         this.setState({countDislikes: 0, countLikes: 0}, () => {this.updateTotal()});
    //     }
    // }
    // updateTotal = () => {
    //     console.log(this.state);
    //     this.setState({totalLikes: this.state.countLikes * this.state.deltaL + parseInt(this.props.likes)});
    //     this.setState({totalDislikes: this.state.countDislikes * this.state.deltaD + parseInt(this.props.dislikes)});
    // }

    componentDidMount = () => {
        // if(this.props.id && this.props.id==1){
        //     this.checkLike();
        //     this.checkDislike();
        // }
        if(this.props.id){
            this.getLike();
            this.getDislike();
        }

    }

    getLike = async () => {
        var likes = url+'posts/'+this.props.id+'/likes'
        const req = new Request(likes, {
            method: 'GET'
        });
        fetch(req)
            .then(response => response.json())
            .then(data => (this.setState({likes: parseInt(data)})))
    }
    getDislike = async () => {
        var likes = url+'posts/'+this.props.id+'/dislikes'
        const req = new Request(likes, {
            method: 'GET'
        });
        fetch(req)
            .then(response => response.json())
            .then(data => (this.setState({dislikes: parseInt(data)})))
    }

    // checkLike = async () => {
    //     console.log("checking like status!")
    //     var likeurl = url+'posts/'+this.props.user+'/like/'+this.props.id;
    //     const req = new Request(likeurl, {
    //         method:'GET'
    //     });
    //     fetch(req)
    //         .then(response => response.json())
    //         .then(data => (this.setState({deltaL: data ? -1 : 1})))
    // }

    // checkDislike = async () => {
    //     console.log("checking like status!")
    //     var likeurl = url+'posts/'+this.props.user+'/dislike/'+this.props.id;
    //     const req = new Request(likeurl, {
    //         method:'GET'
    //     });
    //     fetch(req)
    //         .then(response => response.json())
    //         .then(data => (this.setState({deltaD: data ? -1 : 1})))
    // }
    //posts/userid/like/postid
    reqLike = async () => {
        var likeurl = url+'posts/'+this.props.user+'/like/'+this.props.id;
        const req = new Request(likeurl, {
            method:'PUT'
        });
        fetch(req)
            .then(() => {this.getLike();this.getDislike();})
    }
    //posts/userid/dislike/postid
    reqDislike = async () => {
        var dislikeurl = url+'posts/'+this.props.user+'/dislike/'+this.props.id;
        const req = new Request(dislikeurl, {
            method:'PUT'
        });
        fetch(req)
            .then(() => {this.getLike();this.getDislike();})
    }

    render(){
        return(
            <div style={{
                //overflow: "hidden",
                display: "flex",
                padding: "0",
                width: "50%"
                //marginRight: "33%",
            }} disableSpacing>
                <IconButton onClick={this.handleLike} style={{
                    padding: "0",
                    //marginRight: "15px",
                }}>
                    <ThumbUpAltIcon/>
                    <Typography color="textSecondary">{this.state.likes}</Typography>
                </IconButton>
                <IconButton onClick={this.handleDislike} style={{
                    padding: "0",
                    marginLeft:"55%"
                    //marginRight: "20%",
                }}>
                    <ThumbDownAltIcon/>
                    <Typography color="textSecondary">{this.state.dislikes}</Typography>
                </IconButton>
            </div>
        )
    }
}

export default Rate;

