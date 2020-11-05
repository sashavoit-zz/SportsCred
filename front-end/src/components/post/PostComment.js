import React, { Component } from 'react'
import { Comment } from 'semantic-ui-react'
import './semantic.css'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const log = console.log
const styles = theme => ({
  // root: {
  //   backgroundColor: "#00000060"
  //   //width: "300px",
  // },
  time: {
    // overflow: "hidden", /* will contain if #first is longer than #second */
    // paddingTop: "80px",
    color: "#737373",
    //backgroundColor: "blue",
  },
  collapseButton: {
    float: "right",
    //fontSize: "60px",
  },
  
});

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
    const { classes } = this.props;
    this.first_commts = null
    this.commts = null
    const f_comm = this.props.data.shift()
    if(f_comm){
      this.first_commts =
        <Comment>
          <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/christian.jpg' />
          <Comment.Content>
            <Comment.Author as='a'>{f_comm.lastName + " " + f_comm.firstName}</Comment.Author>
            <Comment.Metadata>
              <span className={classes.time}>{f_comm.time}</span>
            </Comment.Metadata>
            <Comment.Text>{f_comm.content}</Comment.Text>
            <Comment.Actions>
              <a>Reply</a>
            {this.props.data.length > 0 ? <a onClick={this.handleCheckbox} className={classes.collapseButton}>Expand</a> : null}
              
            </Comment.Actions>
          </Comment.Content>
        </Comment>

      this.commts = this.props.data.map((item) =>
        <Comment>
          <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
          <Comment.Content>
            <Comment.Author as='a'>{item.lastName + " " + item.firstName}</Comment.Author>
            <Comment.Metadata>
              <span className={classes.time}>{item.time}</span>
            </Comment.Metadata>
            <Comment.Text>{item.content}</Comment.Text>
            <Comment.Actions>
              <a>Reply</a>
            </Comment.Actions>
          </Comment.Content>
        </Comment>
      );
    }
  }
  render() {
    const { collapsed } = this.state
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