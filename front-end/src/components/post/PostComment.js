import React, { Component } from 'react'
import { Checkbox, Comment } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.css'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


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

class CommentCollapsed extends Component {
  state = { 
    collapsed: true,
    coll_message: "Expand"
  }

  handleCheckbox = (e) => {
    let new_coll = "Expand"
    if(this.state.collapsed){
      new_coll = "Collapse"
    }
    this.setState({ collapsed: !this.state.collapsed, coll_message: new_coll})
  }

  render() {
    const { classes } = this.props;
    const { collapsed } = this.state
    //Collapse Expand
    return (
      <div>
        <Comment.Group>

          <Comment>
            <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/christian.jpg' />
            <Comment.Content>
              <Comment.Author as='a'>Christian Rocha</Comment.Author>
              <Comment.Metadata>
                <span className={classes.time}>2 days ago</span> 
              </Comment.Metadata>
              <Comment.Text className={classes.commentText}>
                I'm very interested in this motherboard. Do you know if it'd
                work in a Intel LGA775 CPU socket?
              </Comment.Text>
              <Comment.Actions>
                <a>Reply</a>
    <a onClick={this.handleCheckbox} className={classes.collapseButton}>{this.state.coll_message}</a> 
              </Comment.Actions>
            </Comment.Content>
          </Comment>

          <Comment.Group collapsed={collapsed}>

            <Comment>
              <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
              <Comment.Content>
                <Comment.Author as='a'>Elliot Fu</Comment.Author>
                <Comment.Metadata>
                  <span className={classes.time}>1 day ago</span>
                </Comment.Metadata>
                <Comment.Text>No, it wont</Comment.Text>
                <Comment.Actions>
                  <a>Reply</a>
                </Comment.Actions>
              </Comment.Content>
            </Comment>

            <Comment>
              <Comment.Avatar
                as='a'
                src='https://react.semantic-ui.com/images/avatar/small/jenny.jpg'
              />
              <Comment.Content>
                <Comment.Author as='a'>Jenny Hess</Comment.Author>
                <Comment.Metadata>
                  <span className={classes.time}>20 minutes ago</span>
                </Comment.Metadata>
                <Comment.Text>Maybe it would.</Comment.Text>
                <Comment.Actions>
                  <a>Reply</a>
                </Comment.Actions>
              </Comment.Content>
            </Comment>

          </Comment.Group>

        </Comment.Group>
      </div>
    )
  }
}

CommentCollapsed.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CommentCollapsed);