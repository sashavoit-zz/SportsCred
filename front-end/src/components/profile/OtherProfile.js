import React, { Component } from 'react';
import Friend from "../profile/EditFriend";
import Tabs from "./ProfileTabs";
import {CardActions, CardHeader,Avatar, CardActionArea} from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Divider } from "@material-ui/core";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import ShareMenu from '../post/ShareMenu';
import { IconButton } from "@material-ui/core";

import {fetchUserProfilePic} from "../../service/ProfileService"

const styles = theme => ({
  root: {
    backgroundColor: "#00000060"
  },
  content: {
    overflow: "hidden", /* will contain if #first is longer than #second */
    paddingTop: "80px",
  },
  menu: {
    float: "left",
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
  },
  leftProfile: {
    float: "left",
    width: "30%",
    textAlign: "center",
  },
  rightProfile: {
    overflow: "hidden",
  },
  bottomProfile: {
    position: "relative",
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