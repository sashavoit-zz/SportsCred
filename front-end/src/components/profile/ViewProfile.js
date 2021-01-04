import React from "react";
import UserProfile from "./OtherProfile";
import { withStyles } from "@material-ui/core/styles";

const userStyles = theme => ({
  root: {
    marginTop: '100px'
  },
});

export class StrangerProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        profile: []
    }
  }

  componentDidMount() {
    const user_url = '/profile/' + this.props.profile;
    console.log("here is the profiel we are vewiing");
    console.log(this.props);
    const user_request = new Request(user_url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Token': localStorage.getItem("Token")
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
        this.setState({
          profile: data
        })
      })
      .catch((error) => {
        console.log(error)
      });
  }
  render() {
    const { classes } = this.props;
    const { user } = this.props;
    return (
      <div className={classes.root}>
        {this.state.profile.map(profile =>
          <UserProfile
            userId={user.email}
            profileInfo={profile}
          />
        )}
      </div>
    );
  }
}
export default withStyles(userStyles)(StrangerProfile);