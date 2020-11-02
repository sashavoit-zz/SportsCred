import React, { Component } from 'react';
import SideBar from "../SideBar/SideBar";


import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
//errmsg
import {Collapse, IconButton} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';

// import { useParams } from "react-router";

import FaceIcon from '@material-ui/icons/Face';
import { CardHeader } from '@material-ui/core';

import {
  EmailShareButton,
  FacebookShareButton,
  RedditShareButton,
  TwitterShareButton,
} from "react-share";

import {
  FacebookShareCount,
  RedditShareCount,
} from "react-share";

import {
  EmailIcon,
  FacebookIcon,
  RedditIcon,
  TwitterIcon,
} from "react-share";

const ACSSCORE = "560"
const letters = /^[A-Za-z]*$/;
const numbers = /^[+\d]?(?:[\d-.\s()]*)$/;

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
  userIcon: {
    fontSize: "100px",
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
    marginBottom:"20px",
    color: "white",
    backgroundColor: "#0066cc",
  },
  cancleButton: {
    marginTop: "20px",
    marginBottom: "20px",
    color: "white",
    backgroundColor: "#333333",
  },
});

class OpenCourtPost extends Component {
  constructor(props) {
    super(props);
    log("--------------------------999")
    log(props)
    this.state = {
      //id: props.param,
      // edit: false,
      // errmsg:false
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
          title: data.Title,
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
    
    // log("03928498394893284923849328492349823000")
    // //log(this.props.match.params.post)
    // log("03928498394893284923849328492349823000")
    // log(this.props)

    return (
        <Card className={classes.root}>
          <CardContent className={classes.content}>
            <CardHeader
              title={this.state.title}//{postInfo.firstName + " " + postInfo.lastName}
              subheader={this.state.content + "this is content of the post"} //{postInfo.time}
            >
            </CardHeader>
          </CardContent>
          <CardActions>

          <FacebookShareButton url="google.com" quote="this is post id24's Quote" hashtag="#post24">
            <FacebookIcon size={32} round={true} /> 
            {/* <FacebookShareCount url={"google.com"} /> */}
            <FacebookShareCount url={"google.com"}>
              {shareCount => <span className="myShareCountWrapper">{shareCount}</span>}
            </FacebookShareCount>
          </FacebookShareButton>

          <TwitterShareButton url="google.com" title="this is title of post 24" hashtag="#post24">
            <TwitterIcon size={32} round={true} />
          </TwitterShareButton>

          <RedditShareButton url="google.com" title="this is title of post 24">
            <RedditIcon size={32} round={true} />
            <RedditShareCount url={"google.com"}>
              {shareCount => <span className="myShareCountWrapper">{shareCount}</span>}
            </RedditShareCount>
          </RedditShareButton>
          </CardActions>
        </Card>
    );
  }
}

OpenCourtPost.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OpenCourtPost);