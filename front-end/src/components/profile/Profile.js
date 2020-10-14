import React from 'react';
import SideBar from "../SideBar/SideBar";

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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

  },
  menu: {
    float: "left",
    //display: "inline-block",
    width: "30%",
    borderRight: "solid grey",
    textAlign: "center",
    paddingTop: "40px",
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
    marginLeft:"30px",
    paddingTop: "40px",
    float: "left",
    width: "30%",
    
    //height:"100%",
    //display: "inline-block",
  },
  rightProfile: {
    paddingTop: "40px",
    overflow: "hidden",
    //height:"100%",
    //display: "inline-block",
  },
  
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
            <div className={classes.leftProfile}>
              <Typography className={classes.option} variant="h5" component="h2">
                Edsdofile
              </Typography>
            </div>
            <div className={classes.rightProfile}>
              <Typography className={classes.option} variant="h5" component="h2">
                Edit Profilesdsds
              </Typography>
            </div>
          </div>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </SideBar>
  );
}

// function Render(){
//   SimpleCard();
// }

export default SimpleCard;