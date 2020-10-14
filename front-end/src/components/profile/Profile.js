import React from 'react';
import SideBar from "../SideBar/SideBar";

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import TextField from '@material-ui/core/TextField';
import FaceIcon from '@material-ui/icons/Face';

const useStyles = makeStyles({
  root: {
    position: "fixed",
    top: 90,
    left: 220,
    bottom: 20,
    right: 20,
    //width: "300px",
  },
  content: {
    overflow: "hidden", /* will contain if #first is longer than #second */
    paddingTop: "80px",
  },
  menu: {
    float: "left",
    //display: "inline-block",
    paddingTop: "40px",
    width: "30%",
    borderRight: "solid grey",
    textAlign: "center",
  },
  option:{
    marginBottom:"30px"
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
  userIcon:{
    fontSize:"100px",
  },
  blueText:{
    color:"#0099ff",
    fontSize:"16px"
  },
  note:{
    color:"#0d0d0d",
    fontSize:"13px",
    // width:"50%",
    // textAlign: "center",
  },
  inputField:{
    width:"50%",
    marginTop:"20px",
  }
});



function SimpleCard() {
  const classes = useStyles();
  //const bull = <span className={classes.bullet}>•</span>;

  return (
    <SideBar page = "Profile">
      <Card className={classes.root}>
        <CardContent className={classes.content}>
          <div className={classes.menu}>
            <Typography className={classes.option} variant="h5" component="h2">
              Edit Profile
            </Typography>
            <Typography className={classes.option} variant="h5" component="h2">
              Change Password
            </Typography>
          </div>
          <div className={classes.profile}>
            <div className={classes.profile}>
              <div className={classes.leftProfile}>
                <FaceIcon className={classes.userIcon}/>
                <Typography className={classes.option} variant="h5" component="h2">
                  Edsdofile
                </Typography>
              </div>
              <div className={classes.rightProfile}>
                <Typography variant="h5" component="h2">
                  Me
                </Typography>
                <div className={classes.blueText}>
                  Update Profile Picture
                </div>
              </div>
            </div>
            <div className={classes.bottomProfile}>
              <TextField className={classes.inputField} id="outlined-basic" label="Name" variant="outlined"/><br/>
              <div className={classes.note}>
                Help people discover your account by using the name you're known by: either your full name, nickname, or business name
              </div>
              <TextField className={classes.inputField} id="outlined-basic" label="About" variant="outlined"/><br/>
              
              <TextField className={classes.inputField} id="outlined-basic" label="Email" variant="outlined"/><br/>
              <TextField className={classes.inputField} id="outlined-basic" label="Phone Number" variant="outlined"/><br/>
               <div className={classes.note}>
                Personal Information (Email & Phone Number):
                This wont be a part of your public profile.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </SideBar>
  );
}

// function Render(){
//   SimpleCard();
// }

export default SimpleCard;