import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import { Alert } from '@material-ui/lab';
import { Redirect } from 'react-router';
import EditFriend from './EditFriend';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import {BrowserRouter} from 'react-router-dom'
import InviteButton from '../trivia/InviteButton'
const url = 'http:///';
const cols = 2;

const useStyles = theme => ({
root: {
    width: '100%',
    '& > * + *': {
        marginTop: theme.spacing(2),
    },
    },
});


function splitarr(arr){
    let len = Math.max(arr.length/cols,1);
    let bites = [];
    for(var i = 0; i < cols; i++){
        if(len*(i+1)<=arr.length){
            bites.push(arr.slice(len*i,len*(i+1)));
        }
    }
    return bites;
}

export class FriendsList extends React.Component {
    constructor(props){
        super(props);
        this.clickedprofile = '';
        this.state = {
            friends: [],
            error: false
        }
    }

    getFriendsList = async () => {
        var query = url+'friendslist/'+this.props.profile;
        let req = new Request(query, {
            method: 'GET'
        });
        fetch(req)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    friends: splitarr(data),
                    error: false

            }, () => {}
            )})
            .catch(function(error){
                console.log(error);
                //this.setState({error: true});
            })
    }
    
    

    componentDidMount = () => {
        this.getFriendsList();
    }

    redirectHandler = (value) => {
        this.clickedprofile = value;
        this.setState({ redirect: true })
        console.log("REDIRECTING TO "+value);
        console.log(this.props);
        //console.log(this.props.history);
        //this.props.history.push('/users/k@mail.com');
        this.renderRedirect();
    }
    renderRedirect = () => {
        let url = '/user/'+this.clickedprofile;
        if(this.clickedprofile == this.props.user){
            url = '/profile';
        }
        if (this.state.redirect) {
            return (<BrowserRouter forceRefresh={true}>
                <Redirect to={url}>
                    
                </Redirect></BrowserRouter>
                
            );
            //return null;
        }
    }


    

    render(){
        const {classes} = this.props;
        const {user} = this.props;
        if(this.state.error){
            return (
                <div className={classes.root}>
                    {this.renderRedirect()}
                    <Alert severity="error">Error - Unable to load friends</Alert>
                </div>
            );
        }
        else if(this.state.friends.length == 0){
            return (
                <div className={classes.root}>
                    {this.renderRedirect()}
                    <Alert severity="info">This user has not added anyone as a friend</Alert>
                </div>
            );
        }
        else {
            return(
            <div className={classes.root}>
                {this.renderRedirect()}
                <Grid container>
                    {this.state.friends.map(friends =>{
                        console.log(friends)
                        return(
                            <Grid item xs={6}>
                                {friends.map(friend =>{
                                    let editfriend = null;
                                    if(user != friend.email){
                                        editfriend = <EditFriend user={user} stranger={friend.email} msg="false"/>;
                                    }
                                    let divider;
                                    // if(loop==friends.length){
                                    //     divider = '';
                                    // }
                                    // else{
                                    //     divider = <Divider variant="inset" component="li" />;
                                    // }
                                    divider = <Divider variant="inset" component="li" />;
                                    return (
                                    <List className={classes.root}>
                                        <ListItem button alignItems="flex-start" onClick={() => this.redirectHandler(friend.email)}>
                                            <ListItemAvatar>
                                                <Avatar alt="" src=""/>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <div>
                                                        <span style={{ fontWeight: "bold" }}>{friend.firstname + ' ' + friend.lastname + "   "}</span>
                                                        <span style={{ color: "#737373" }}>{"ACS: " + friend.acs}</span>
                                                    </div>
                                                    //friend.firstname+' '+friend.lastname + ' ACS:' + friend.acs
                                                }
                                                secondary={
                                                    <React.Fragment>
                                                        {friend.about}
                                                    </React.Fragment>
                                                }
                                            />

                                            
                                            <ListItemSecondaryAction>
                                                {/* <IconButton edge="end" aria-label="PersonAdd">
                                                <PersonAddIcon />
                                                </IconButton> */}
                                                <Grid
                                                    container
                                                    direction="row"
                                                    justify="center"
                                                    alignItems="center"
                                                >
                                                    <InviteButton email={friend.email} />
                                                    {editfriend}
                                                </Grid>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        {divider}
                                    </List>
                                    );
                                })}
                            </Grid>
                        );
                    })}
                </Grid>
            </div>
            );
        }
    }

        // <Grid container>
        //     <Grid item xs={6}> 
        //         bruh
        //     </Grid>
        //     <Grid item xs={6}>
                
        //     </Grid>
        // </Grid>


        // <List className={classes.root}>
        //     <ListItem button alignItems="flex-start">
        //         <ListItemAvatar>
        //             <Avatar alt="" src=""/>
        //         </ListItemAvatar>
        //         <ListItemText
        //         primary="a1"
        //         secondary={
        //         <React.Fragment>
        //             bruhassssssssssssssssssssssssss
        //         </React.Fragment>
        //         }
        //         />
        //         <ListItemSecondaryAction onClick={console.log("add friend")}>
        //             {/* <IconButton edge="end" aria-label="PersonAdd">
        //             <PersonAddIcon />
        //             </IconButton> */}
        //             friend
        //         </ListItemSecondaryAction>
        //     </ListItem>
        //     <Divider variant="inset" component="li" />
        // </List>
        
    
}
FriendsList.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  
  export default withRouter(withStyles(useStyles)(FriendsList));
