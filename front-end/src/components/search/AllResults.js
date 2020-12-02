import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Pagination from '@material-ui/lab/Pagination';
import Friend from "../profile/EditFriend";
import Post from '../open-court/post'
import {uid} from "react-uid";
import {useHistory} from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import {
    AppBar,
    Toolbar,
  } from "@material-ui/core";
  
  
import TextField from '@material-ui/core/TextField';
  
const drawerWidth = 200;
const url = '/search/';

const useStyles = theme => ({
    root: {
      width: '100%',
      maxWidth: '500px',
      backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        [theme.breakpoints.up("sm")]: {
          width: `calc(80% - ${drawerWidth}px)`,
          marginLeft: drawerWidth+100,
        },
    },
    inputField: {
        width: "100%",
    },
  });


class SearchAll extends Component {
    constructor(props){
        super(props);
        this.user = props.user;
        this.clickedprofile = '';
        this.state = {
            userResults: {},
            postResults: {},
            loadingUsers: false,
            loadingPosts: false,
            messageUsers: '',
            messagePosts: '',
            currPage: 0,
            numPages: 0,
            numResults: 0,
            pageCount: 10,
            redirect: false
        }
        
    }


    getPageCount = (totalItemCount, itemsPerPage) => {
        return Math.ceil(totalItemCount / itemsPerPage);
    }

    queryUsers = async () => {
        var userOptions = this.user+'&'+this.state.currPage+'&'+3;
        var userQuery = url+'users/?search='+this.props.query+'&params='+btoa(userOptions);
        const userReq = new Request(userQuery, {
            method:'GET'
        });
        console.log("fetching user result")
        console.log(userOptions);
        console.log(userQuery);
        this.setState({loading: true}, ()=>{
            fetch(userReq)
            .then(response => response.json())
            .then(data => {
                const cmessage = ! data.length ? 'No matching results' : '';
                this.setState({
                    loadingUsers: false,
                    userResults: data,
                    messageUsers: cmessage
            }, () => {
                console.log("after querystate");
                console.log("ASKJDHALKJSHDLKJASLGFJAKSJHDJLKA\n\n\n\n\nALKSJDHLAS")
                console.log(this.state.userResults);
                this.renderUsers()}
            )})
            .catch((error) =>this.setState({
                loadingUsers: false,
                userResults: {},
                messageUsers: 'Network error'
            }));
        })
    }

    queryPosts = async () => {
        var postOptions = this.user+'&'+this.state.currPage+'&'+this.state.pageCount;
        var postQuery = url+'posts/?search='+this.props.query+'&params='+btoa(postOptions);
        const postReq = new Request(postQuery, {
            method:'GET'
        });
        this.setState({loading: true}, ()=>{
            fetch(postQuery)
            .then(response => response.json())
            .then(data => {
                const cmessage = ! data.length ? 'No matching results' : '';
                this.setState({
                    loadingPosts: false,
                    postResults: data,
                    messagePosts: cmessage
                })
            })
            .catch((error) =>this.setState({
                loadingPosts: false,
                postResults: {},
                messagePosts: 'Network error'
            }));
        })
    }

    componentDidMount(){
        console.log("componeto did mount ")
        this.queryUsers();
        this.queryPosts();
    }

    renderUsers() {
        const {classes} = this.props;
        const {user} = this.props;
        const {query} = this.props;
        const {userResults} = this.state;
        console.log("RENDER USERS")
        console.log(userResults)
        console.log(this.state)
        

        if(Object.keys(userResults).length && userResults.length){
            var loop = 1;
            return(
                <List className={classes.root}>
                    {userResults.map(profile => {
                        if(profile != null){
                           
                        
                        let divider;
                        if(loop==userResults.length){
                            divider = '';
                        }
                        else {
                            divider = <Divider variant="inset" component="li" />;
                        }
                        loop += 1;
                        var friend = <Friend user={user} stranger={profile.email} msg="true"/>;
                        if(user == profile.email){
                            friend = null;
                        }
                        return(
                            <div key={profile.email} className="list-item">
                            <ListItem button alignItems="flex-start" onClick={() => this.redirectHandler(profile.email)}>
                                <ListItemAvatar>
                                    <Avatar alt={profile.email} src={profile.profilePic}/>
                                </ListItemAvatar>
                                <ListItemText
                                primary={profile.username}
                                secondary={
                                <React.Fragment>
                                    {profile.about}
                                </React.Fragment>
                                }
                                />
                                <ListItemSecondaryAction onClick={console.log("add friend")}>
                                    {/* <IconButton edge="end" aria-label="PersonAdd">
                                    <PersonAddIcon />
                                    </IconButton> */}
                                    {friend}
                                </ListItemSecondaryAction>
                            </ListItem>
                            {divider}
                            </div>
                        )
                        }
                    })}
                </List>
            );
        }
    }

    renderPosts(){
        const {classes} = this.props;
        const {user} = this.props;
        const {postResults} = this.state;
        if(Object.keys(postResults).length && postResults.length){
            return(
                <div>
                {postResults.map(post => {
                    if(post != null){
                        return(
                        <Post 
                            key={uid(post)}
                            postInfo={post}
                            userId={user}
                        />);
                    }
                })}
                </div>
            );
 

        }
    }

    render() {
        const {user} = this.props;
        const {query} = this.props;
        const {classes} = this.props;
        return(
            <div>
            {this.renderUsers()}
            {this.renderPosts()}
            </div>
        )
        
    }
}
// export default SearchBar
// export default() => {
//     const classes = useStyles();
//     console.log("bruh1");
//     return <SearchBar classes={classes} user123/>
// }
SearchAll.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(useStyles)(SearchAll);