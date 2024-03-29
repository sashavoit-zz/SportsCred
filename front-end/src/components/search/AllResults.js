import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Friend from "../profile/EditFriend";
import Post from '../open-court/Post'
import {uid} from "react-uid";
import { Redirect } from 'react-router';

import { Alert, AlertTitle } from '@material-ui/lab';

import InviteButton from '../trivia/InviteButton'
import Grid from '@material-ui/core/Grid'

const drawerWidth = 200;
const url = '';

const useStyles = theme => ({
    root: {
      width: '100%',
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

    handlePageChange = (e, value) => {
        e.preventDefault();
        var newPage = value;
        console.log("page changed to newPage");
        this.setState({
            currPage: newPage
        }, () => {
            if(!this.state.loading){
                this.setState({
                    loading: true,
                    message: ''
                }, () =>{
                    this.querySearch();
                });
            }
        });
    }

    redirectHandler = (value) => {
        this.clickedprofile = value;
        this.setState({ redirect: true })
        this.renderRedirect();
    }
    renderRedirect = () => {
        let url = '/user/'+this.clickedprofile;
        if(this.clickedprofile == this.props.user){
            url = '/profile';
        }
        if (this.state.redirect) {
            return <Redirect to={url}/>
        }
    }

    encode(value){
        let a = btoa(value)
        a = a.replaceAll("/","-");
        return a;
    }


    getPageCount = (totalItemCount, itemsPerPage) => {
        return Math.ceil(totalItemCount / itemsPerPage);
    }

    queryUsers = async () => {
        var userOptions = this.user+'&'+this.state.currPage+'&'+10;
        var userQuery = url+'/search/users/?search='+this.props.query;
        userQuery = encodeURI(userQuery);
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
        var postQuery = url+'/search/posts/?search='+this.props.query;
        postQuery = encodeURI(postQuery);
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

    componentDidUpdate(oldProps) {
        if (oldProps.query != this.props.query) {
            console.log("componeto did update ")
            this.queryUsers();
            this.queryPosts();
        }
    }

    renderUsers() {
        const {classes} = this.props;
        const {user} = this.props;
        const {query} = this.props;
        const {userResults} = this.state;
        console.log("RENDER USERS1");
        console.log(userResults)
        console.log(this.state)
        

        if(Object.keys(userResults).length && userResults.length && userResults.length > 0){
            var loop = 1;
            return(
                <List className={classes.root}>
                    {this.renderRedirect()}
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
                        var invite = <InviteButton email={profile.email}/>;
                        if(user == profile.email){
                            friend = null;
                            invite = null;
                        }
                        return(
                            <div key={profile.email} className="list-item">
                            <ListItem button alignItems="flex-start" onClick={() => this.redirectHandler(profile.email)}>
                                <ListItemAvatar>
                                    <Avatar alt={profile.email} src={profile.profilePic}/>
                                </ListItemAvatar>
                                {/* <ListItemText
                                primary={profile.username}
                                secondary={
                                <React.Fragment>
                                    {profile.about}
                                </React.Fragment>
                                }
                                /> */}

                                <ListItemText
                                    primary={
                                        <div>
                                            <span style={{ fontWeight: "bold" }}>{profile.username + "   "}</span>
                                            <span style={{ color: "#737373" }}>{"ACS: " + profile.acs}</span>
                                        </div>
                                        //friend.firstname+' '+friend.lastname + ' ACS:' + friend.acs
                                    }
                                    secondary={
                                        <React.Fragment>
                                            {profile.about}
                                        </React.Fragment>
                                    }
                                />



                                <ListItemSecondaryAction onClick={console.log("add friend")}>

                                    <Grid
                                        container
                                        direction="row"
                                        justify="center"
                                        alignItems="center"
                                    >
                                    {friend}
                                    </Grid>
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
        if(Object.keys(postResults).length && postResults.length && postResults.length > 0){
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
        const {type} = this.props;
        let messageAll = "";
        let messageUser = "";
        let messagePosts = "";


        if(this.state.userResults && this.state.userResults.length == 0){
            messageUser = <Alert severity="info">No results for users matching {this.props.query}</Alert>;
        }
        if(this.state.postResults && this.state.postResults.length == 0){
            messagePosts = <Alert severity="info">No results for posts matching {this.props.query}</Alert>;
        }
        if(messageUser != "" && messagePosts != ""){
            messageAll = <Alert severity="info">No results for search {this.props.query}</Alert>;
        }

        if(type == 'all'){
            return(
                <div>
                    {this.renderUsers()}
                    {this.renderPosts()}
                    {messageAll}
                </div>
            )
        } else if (type == 'user'){
            return(
                <div>
                    {this.renderUsers()}
                    {messageUser}
                </div>
            )
        } else {
            return(
                <div>
                    {this.renderPosts()}
                    {messagePosts}
                </div>
            )
        }
        
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