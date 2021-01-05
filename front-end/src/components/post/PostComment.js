import React, { Component } from 'react'
import { Comment } from 'semantic-ui-react'
import './semantic.css'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  time: {
    color: "#737373",
  },
  collapseButton: {
    float: "right",
  },
  posterAcs: {
    float: "right",
  },
  
});

function formatDate(timeFromDb) {

  let months = [
    "January", "February",  "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]

  if (!timeFromDb) {
    return null
  }else{
    let dateArr = timeFromDb.split("/")
    let year = dateArr[2]
    let month = dateArr[1]
    let day = dateArr[0]

    return day + " " + months[month - 1] + " " + year
  }
}

class PostComment extends Component {
  state = { 
    collapsed: true,
  }

  handleCheckbox = (e) => {
    let new_coll = "Expand"
    if(this.state.collapsed){
      new_coll = "Collapse"
    }
    e.target.text = new_coll
    this.setState({ collapsed: !this.state.collapsed})
  }
  componentDidMount() {
    
  }
  render() {
    const { collapsed } = this.state

    const { classes } = this.props;
    this.first_commts = null
    this.commts = null
    const data = this.props.data
    const f_comm = data[0]
    const r_comm = data.slice(1)
    if (f_comm) {
      this.first_commts =
        <Comment>
          <Comment.Avatar as='a' href={f_comm.email == localStorage.getItem("User") ? "/profile" : "user/" + f_comm.email} src={f_comm.profilePic} />
          <Comment.Content>
          <Comment.Author as='a' href={f_comm.email == localStorage.getItem("User") ? "/profile" : "user/" + f_comm.email}>{f_comm.firstName+ " " + f_comm.lastName + " - ACS: " + f_comm.acs}</Comment.Author>
            <Comment.Metadata>
            <span className={classes.time}>{formatDate(f_comm.time)}</span>
            </Comment.Metadata>
            {/* <span className={classes.posterAcs}>{}</span> */}
            <Comment.Text>{f_comm.content}</Comment.Text>
            <Comment.Actions>
              {/* <a>{f_comm.time}</a> */}
            {r_comm.length > 0 ? <a onClick={this.handleCheckbox} className={classes.collapseButton}>Expand</a> : null}

            </Comment.Actions>
          </Comment.Content>
        </Comment>

      this.commts = r_comm.map((item) =>
        <Comment>
          <Comment.Avatar as='a' href={item.email == localStorage.getItem("User") ? "/profile" : "user/" + item.email} src={item.profilePic} />
          <Comment.Content>
            <Comment.Author as='a' href={item.email == localStorage.getItem("User") ? "/profile" : "user/" + item.email}>{item.firstName+ " " + item.lastName}</Comment.Author>
            <Comment.Metadata>
              <span className={formatDate(f_comm.time)}>{formatDate(f_comm.time)}</span>
            </Comment.Metadata>
            {/* <span className={classes.posterAcs}>{"ACS: "+item.acs}</span> */}
            <Comment.Text>{item.content}</Comment.Text>
            <Comment.Actions>
              {/* <a>{item.time}</a> */}
            </Comment.Actions>
          </Comment.Content>
        </Comment>
      );
    }

    return (
      <div>
        <Comment.Group>
          {this.first_commts}
          <Comment.Group collapsed={collapsed}>
            {this.commts}
          </Comment.Group>
        </Comment.Group>
      </div>
    )
  }
}

PostComment.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PostComment);