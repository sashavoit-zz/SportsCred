import React, { Component } from 'react';
import SideBar from "../SideBar/SideBar";
import Tabs from "./ProfileTabs";
import PassDialog from "./ChangePassword";
import OptionButton from "./OptionButton";

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import FaceIcon from '@material-ui/icons/Face';
const USERNAME = "Ben"
const ACSSCORE = "560"

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
    color: "white",
    backgroundColor: "#0066cc",
  },
  cancleButton: {
    marginTop: "20px",
    color: "white",
    backgroundColor: "#333333",
  },
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
      name_tag.textContent = input.lastName + " " + input.firstName;
    })
    .catch((error) => {
      console.log(error)
    });
}

class Profile extends Component {
  constructor(props) {
    super(props);

    // get_user(this.props.user.email)
    const user_url = '/user/' + this.props.user.email;
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
          phone: data.Phone
        })
        //render_reports(data);
      })
      .catch((error) => {
        console.log(error)
      });
    this.state = {
      edit: false
    }
  }

  handleBackProfile = (event) => {
    event.preventDefault()
    this.setState({
      edit: false
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const data = { ...this.state, ...this.props.user }
    console.log("form submit:", data)
    post_profile(data);
    this.handleBackProfile(event);
  }

  handleInputChange = (event) => {
    event.preventDefault()
    this.setState({
      //console.log(event.target.value)
      // ["email"]: "ben@sportcred.com",
      [event.target.id]: event.target.value
    })
  }


  render() {
    const { classes } = this.props;

    const profileContent = this.state.edit ? (
      <form onSubmit={this.handleSubmit} noValidate autoComplete="off">
        <TextField className={classes.inputField} id="email" label={this.props.user.email} variant="filled" onChange={this.handleInputChange} disabled /><br />
        <TextField className={classes.inputFieldShort} id="lastName" label="Last Name" value={this.state.lastName} variant="filled" onChange={this.handleInputChange} />
        <TextField className={classes.inputFieldShort} id="firstName" label="First Name" value={this.state.firstName} variant="filled" onChange={this.handleInputChange} /><br />
        <div className={classes.note}>
          Help people discover your account by using the name you re <br />
          known by: either your full name, nickname, or business name
        </div>
        <TextField className={classes.inputField} id="about" label="About" value={this.state.about} variant="filled" onChange={this.handleInputChange} /><br />
        <TextField className={classes.inputField} id="phone" label="Phone Number" value={this.state.phone} variant="filled" onChange={this.handleInputChange} /><br />
        <div className={classes.note}>
          Personal Information (Email & Phone Number): <br />
          This wont be a part of your public profile.
        </div>
        <Button className={classes.submitButton} type="submit">Submit</Button> <Button className={classes.cancleButton} onClick={this.handleBackProfile} >Cancel</Button>
      </form>
    ) : (
        <Tabs>
        </Tabs>
      )

    return (
        <Card className={classes.root}>
          <CardContent className={classes.content}>
            <div className={classes.menu}>

              {/* <OptionButton></OptionButton> */}

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
              {profileContent}
            </div>
          </CardContent>
        </Card>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);