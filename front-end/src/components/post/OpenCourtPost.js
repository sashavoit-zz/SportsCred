import React, { Component } from 'react';
import SideBar from "../SideBar/SideBar";


import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
//errmsg
import {Collapse, IconButton} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';

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
    
    this.state = {
      edit: false,
      errmsg:false
    }
  }



  render() {
    const { classes } = this.props;
    
    log("03928498394893284923849328492349823000")
    log(this.props.match.params.post)
    log("03928498394893284923849328492349823000")
    log(this.props)

    return (
        <Card className={classes.root}>
          <CardContent className={classes.content}>
            <div className={classes.menu}>

              {/* <OptionButton></OptionButton> */}

            <Typography onClick={() => this.setState({ edit: true })} className={classes.option} variant="h5" component="h2" style={{ cursor: 'pointer' }}>
                Edit Profile
              </Typography>


            <Typography className={classes.option} variant="h5" component="h2" style={{ cursor: 'pointer' }}>
                
              </Typography>

            </div>
            <div className={classes.profile}>
              <div className={classes.profile}>
                <div className={classes.leftProfile}>
                  <FaceIcon onClick={this.handleBackProfile} className={classes.userIcon} />
                  <Typography id="username" onClick={this.handleBackProfile} className={classes.option} variant="h5" component="h2">
                  </Typography>
                </div>
                <div className={classes.rightProfile}>
                  <Typography variant="h5" component="h2">
                    ACS Score: {ACSSCORE}
                  </Typography>
                  <div className={classes.blueText}>
                    Update Profile Picture
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.bottomProfile}>
              
            </div>
          </CardContent>
        </Card>
    );
  }
}

OpenCourtPost.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OpenCourtPost);