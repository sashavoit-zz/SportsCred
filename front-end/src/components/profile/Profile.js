import React, { Component } from 'react';
import SideBar from "../SideBar/SideBar";
import Tabs from "./ProfileTabs";
import PassDialog from "./ChangePassword";
import OptionButton from "./OptionButton";

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
//errmsg
import { Collapse, IconButton,Avatar, Card, CardContent, Button, Typography, TextField} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import UploadPicPopup from './UploadPicPopup'
import {fetchUserProfilePic} from "../../service/ProfileService"

// <<<<<<< HEAD
// import FaceIcon from '@material-ui/icons/Face';
// //const ACSSCORE = "560"
// =======
// const ACSSCORE = "560"
// >>>>>>> master
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
    marginTop: "30px",
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
  profilePic:{
    margin:"auto",
    height:"100px",
    width:"100px"
  }
});




function post_profile(input) {
  log(input)
  const url = '/profile'; //http://localhost:3001
  const data = {
    email: input.email,
    lastName: input.lastName,
    firstName: input.firstName,
    about: input.about,
    phone: input.phone,
  }
  const profile_request = new Request(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'Token': localStorage.getItem("Token") // move whole function to ApiCalls.js later
    }
  });
  fetch(profile_request)
    .then(res => {
      const name_tag = document.querySelector("#username");
      name_tag.textContent = input.firstName + " " + input.lastName;
    })
    .catch((error) => {
      console.log(error)
    });
}

class Profile extends Component {
  constructor(props) {
    super(props);

    // get_user(localStorage.getItem("User"))
    // log("------user email passed in from props:")
    // log(localStorage.getItem("User"))
    // log(localStorage.getItem("User"))
    this.state = {
      edit: false,
      errmsg: false,
      openPopup: false,
      selectedFile: null,
      profileLink: null,
      uploaded: false
    }
  }
  componentDidMount(){
    this.getUserProfile();
    this.getUserProfilePic();
    console.log("getting user profile");
  }

  getUserProfile = async() => {
    const user_url = '/user/' + localStorage.getItem("User");

    const user_request = new Request(user_url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Token': localStorage.getItem("Token") // move whole function to ApiCalls.js later
      }
    });
    fetch(user_request)
      .then(res => {
        if (res.status == 200) {
          return res.json();
        } else {
          console.log('could not get user');
        }
      })
      .then(data => {
        const name_tag = document.querySelector("#username");
        name_tag.textContent = data.FirstName + " " + data.LastName;
        this.setState({
          firstName: data.FirstName,
          lastName: data.LastName,
          about: data.About,
          phone: data.Phone,
          acs: data.Acs,
        })
        //render_reports(data);
      })
      .catch((error) => {
      });
  }
  

  handleBackProfile = (event) => {
    event.preventDefault()
    this.setState({
      edit: false
    })
  }
  handleCloseErrmsg = (event) => {
    event.preventDefault()
    this.setState({
      errmsg: false
    })
  }
  handleShowErrmsg = (event) => {
    event.preventDefault()
    this.setState({
      errmsg: true
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const form_cond = (!this.state.firstName.match(letters) ||
      this.state.firstName === "" ||
      !this.state.lastName.match(letters) ||
      this.state.lastName === "" ||
      !this.state.phone.match(numbers) ||
      this.state.phone === "");
    if (form_cond) {
      this.handleShowErrmsg(event);
    } else {
      const data = { ...this.state, ...this.props.user }
      post_profile(data);
      this.handleBackProfile(event);
    }
  }

  handleInputChange = (event) => {
    event.preventDefault()
    this.setState({
      [event.target.id]: event.target.value
    })
  }
  // componentDidMount(){
      
      
  // }
  
   async getUserProfilePic(){
    const result = await fetchUserProfilePic(this.props.user.email)
    this.setState({profileLink: result})
  }
 
  render() {
    const { classes } = this.props;
    
    const profileContent = this.state.edit ? (
      <form onSubmit={this.handleSubmit} noValidate autoComplete="off">
        <TextField className={classes.inputField} id="email" label={localStorage.getItem("User")} variant="filled" onChange={this.handleInputChange} disabled /><br />
        <TextField error={this.state.lastName === "" || !this.state.lastName.match(letters) ? true : false} className={classes.inputFieldShort} id="lastName" label="Last Name" value={this.state.lastName} variant="filled" onChange={this.handleInputChange} />
        <TextField error={this.state.firstName === "" || !this.state.firstName.match(letters) ? true : false} className={classes.inputFieldShort} id="firstName" label="First Name" value={this.state.firstName} variant="filled" onChange={this.handleInputChange} /><br />
        <div className={classes.note}>
          Help people discover your account by using the name you re <br />
          known by: either your full name, nickname, or business name
        </div>
        <TextField error={this.state.about === "" ? true : false} className={classes.inputField} id="about" label="About" value={this.state.about} variant="filled" onChange={this.handleInputChange} /><br />
        <TextField error={this.state.phone === "" || !this.state.phone.match(numbers) ? true : false} className={classes.inputField} id="phone" label="Phone Number" value={this.state.phone} variant="filled" onChange={this.handleInputChange} /><br />
        <div className={classes.note}>
          Personal Information (Email & Phone Number): <br />
          This wont be a part of your public profile.
        </div>
        <Button className={classes.submitButton} type="submit">Submit</Button> <Button className={classes.cancleButton} onClick={this.handleBackProfile} >Cancel</Button>
        <Collapse in={this.state.errmsg}>
          <Alert
            variant="outlined" severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={this.handleCloseErrmsg}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            Please fill all the required fields
            </Alert>
        </Collapse>
      </form>
    ) : (
        <Tabs user={localStorage.getItem("User")} profile={localStorage.getItem("User")}>
        </Tabs>
      )

    return (
      <Card className={classes.root}>
        <CardContent className={classes.content}>
          <div className={classes.menu}>

            <Typography onClick={() => this.setState({ edit: true })} className={classes.option} variant="h5" component="h2" style={{ cursor: 'pointer' }}>
              Edit Profile
              </Typography>


            <Typography className={classes.option} variant="h5" component="h2" style={{ cursor: 'pointer' }}>
              <PassDialog></PassDialog>
            </Typography>

          </div>
          <div className={classes.profile}>
            <div className={classes.profile}>
              <div className={classes.leftProfile}>
                <IconButton>
                <Avatar
                  className={classes.profilePic}
                  src={this.state.profileLink}
                  onClick={() => this.setState({ openPopup: true })}
                />
                </IconButton>
                <Typography id="username" onClick={this.handleBackProfile} className={classes.option} variant="h5" component="h2">
                </Typography>
              </div>
              <div className={classes.rightProfile}>
                <Typography variant="h5" component="h2">
                  ACS Score: {this.state.acs}
                </Typography>
                  <Button 
                    color="primary"
                    component="label"
                    onClick={() => this.setState({ openPopup: true })}
                  >
                    Upload Profile Picture
                    
                  </Button>
              </div>
            </div>
          </div>
          <div className={classes.bottomProfile}>
            {profileContent}
          </div>
        </CardContent>
        <UploadPicPopup
                profilePage = {this}
                email = {this.props.user.email}
                src = {this.state.profileLink}
            >
                
            </UploadPicPopup>
      </Card>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);