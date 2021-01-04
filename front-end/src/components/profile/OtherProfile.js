import React, { Component } from 'react';
import SideBar from "../SideBar/SideBar";
import Friend from "../profile/EditFriend";
import Tabs from "./ProfileTabs";
import PassDialog from "./ChangePassword";
import OptionButton from "./OptionButton";
import {CardActions, CardHeader,Avatar, CardActionArea} from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Box, Divider } from "@material-ui/core";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import ShareMenu from '../post/ShareMenu';
//errmsg
import { Collapse, IconButton } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';


import {fetchUserProfilePic} from "../../service/ProfileService"
import FaceIcon from '@material-ui/icons/Face';
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
    marginTop: "0px",
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
  contentDivider: {
    marginTop: "15px"
  },
  cardAction: {
    paddingLeft: "0",
  },
  profilePic:{
    margin:"auto",
    height:"100px",
    width:"100px"
  },
});

const url = 'localhost:3001/profile'; //http://localhost:3001


class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileLink: null,
    }
  }

  async getUserProfilePic(){
    console.log("in user profile fetch");
    console.log(this.props);
    const result = await fetchUserProfilePic(this.props.profileInfo.email);
    this.setState({profileLink: result})
  }

  componentDidMount = () => {

    this.getUserProfilePic();

  }






  render() {
    const { classes } = this.props;
    const {userId} = this.props;
    const {profileInfo} = this.props;
    var friend = null;
    if(userId != profileInfo.email){
        friend = <Friend user={userId} stranger={profileInfo.email} msg="true"/>;
    }
    return (
      <Card className={classes.root}>
        <CardContent className={classes.content}>


            <div className={classes.profile}>
              <div className={classes.leftProfile}>
              <IconButton>
                <Avatar
                  className={classes.profilePic}
                  src={this.state.profileLink}
                />
                </IconButton><Typography id="username" onClick={this.handleBackProfile} className={classes.option} variant="h5" component="h2">
                    {profileInfo.firstname}&nbsp;{profileInfo.lastname}
                </Typography>
              </div>
              <div className={classes.rightProfile}>
                <Typography variant="h5" component="h2">
                  ACS Score: {profileInfo.acs}
                </Typography>
                <div>
                  {profileInfo.about}
                </div>
              </div>
            </div>
            <Divider className={classes.contentDivider}></Divider>
                        <CardActions className={classes.cardAction} disableSpacing>
                           {friend}
                            
                                
            
                            <IconButton className={classes.iconButton}>
                                <ShareMenu
                                    data={['google.com', 'Check out this profile!', "#SportCred"]} //url, content, and hashtag
                                />
                      
                            </IconButton>
                        </CardActions>
   
          <div className={classes.bottomProfile}>
            {/* {profileContent} */}
            <Tabs user={userId} profile={profileInfo.email}>
        </Tabs>
          </div>
        </CardContent>
      </Card>
    );
  }
}

UserProfile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserProfile);