import React, { Component } from 'react';
import SideBar from "../SideBar/SideBar";


import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import ShareMenu from './ShareMenu';
import PostComment from './PostComment';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

//errmsg
import { Collapse, Hidden, IconButton, Box, Divider} from "@material-ui/core";

// import { useParams } from "react-router";

import FaceIcon from '@material-ui/icons/Face';
import LaunchIcon from '@material-ui/icons/Launch';
import { CardHeader } from '@material-ui/core';


import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import CommentIcon from '@material-ui/icons/Comment';

import { Link } from 'react-router-dom';


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
    marginTop: "60px",
  },
  cardRoot: {
    overflow: "hidden",
    backgroundColor: "#00000060"
  },
  userIcon: {
    float:"left",
    fontSize: "60px",
    margin:"12px"

  },
  launchIcon:{
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
  cardAction:{
    paddingLeft: "0",
  },
  cardName:{
    fontSize: "15px"
  },
  postInfo: {
    color: "#737373",
  },
  cardBody:{
    fontSize:"15px",
  },
  iconButton:{
    padding: "0",
    marginRight: "20%",
    //frontSize: "15"
  },
});

class OpenCourtPost extends Component {
  constructor(props) {
    super(props);
    // log("--------------------------999")
    // log(props)
    this.state = {
      //url: window.location.href
      url: "google.com"
    }
  }

  componentDidMount() {
    const user_url = '/post/' + this.props.param;
    const user_request = new Request(user_url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Token': localStorage.getItem("Token") // move whole function to ApiCalls.js later
      }
    });
    fetch(user_request)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          console.log('could not get post');
        }
      })
      .then(data => {
        // success get post object in data
        log("okhteethetheht--")
        log(data)
        // const name_tag = document.querySelector("#username");
        // name_tag.textContent = data.FirstName + " " + data.LastName;
        this.setState({
          content: data.Content,
          likes: data.Likes,
          dislikes: data.Dislikes
        })
        //render_reports(data);
      })
      .catch((error) => {
        console.log(error)
      });
  }


  render() {
    const { classes } = this.props;

    return (
      <div className={classes.cardArea}>
        <Card className={classes.cardRoot} variant="outlined">
          <FaceIcon className={classes.userIcon}></FaceIcon>
          <CardContent className={classes.cardContent}>
            <div className={classes.cardName}>
              <Box style={{ fontWeight: "bold" }} display='inline'>
                {this.state.content + "   "}
              </Box>
              <Box className={classes.postInfo} display='inline'>
                @user_name - Nov 1
              </Box>
              {/* <Link to={"/the-zone/" + postInfo.postId}>  */}
                <LaunchIcon className={classes.launchIcon}></LaunchIcon>
              {/* </Link> */}
            </div>
            <div className={classes.cardBody}>
              {this.state.content}
            </div>
            <Divider></Divider>
            <CardActions className={classes.cardAction} disableSpacing>
              <IconButton className={classes.iconButton}>
                <ThumbUpAltIcon />
                {/* <Typography color="textSecondary">{postInfo.likes}</Typography> */}
              </IconButton>
              <IconButton className={classes.iconButton}>
                <ThumbDownAltIcon />
                {/* <Typography color="textSecondary">{postInfo.dislikes}</Typography> */}
              </IconButton>
              <IconButton className={classes.iconButton}>
                {/**TODO: onlick to reply the post */}
                <CommentIcon />
              </IconButton>
              <IconButton className={classes.iconButton}>
                {/**TODO: onlick to reply the post */}
                <ShareMenu 
                  data={[this.state.url, this.state.content, "#SportCred"]} 
                />
              </IconButton>
            </CardActions>
          </CardContent>
        </Card>
        {/* <PostComment /> */}
      </div>
    );
  }
}

OpenCourtPost.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OpenCourtPost);