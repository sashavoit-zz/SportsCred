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

import {useHistory} from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import {
    AppBar,
    Toolbar,
  } from "@material-ui/core";
  
  
import TextField from '@material-ui/core/TextField';

import InviteButton from '../trivia/InviteButton'
import Grid from '@material-ui/core/Grid'
  
const drawerWidth = 200;
const url = '/search?';

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


class SearchBar extends Component {
    constructor(props){
        super(props);
        this.searchType = 'user';
        this.user = props.user;
        this.clickedprofile = '';
        this.state = {
            query: '',
            results: {},
            loading: false,
            message: '',
            currPage: 0,
            numPages: 0,
            numResults: 0,
            pageCount: 20,
            queryType: 'user',
            redirect: false
        }
        
    }


    getPageCount = (totalItemCount, itemsPerPage) => {
        return Math.ceil(totalItemCount / itemsPerPage);
    }

    querySearch = async () => {
        //search?user,searchtype,query,pagenum,showpage
        //search/user/searchtype
        //console.log(JSON.stringify(this.state));
        var options = this.user+'&'+this.state.queryType;
        options += '&'+this.state.currPage+'&'+this.state.pageCount;

        var query = url;
        query += 'search='+this.state.query;
        query += '&params='+btoa(options);
        console.log(query);

        const req = new Request(query, {
            method:'GET'
        });

        this.setState({ loading: true }, () =>{
            fetch(query)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    console.log("bruh1");
                    console.log(data.Total);
                    console.log(data.Profiles.length);
                    console.log(data.Profiles);


                    const count = data.Total;
                    const totalPages = this.getPageCount(count, this.state.pageCount);
                    const cmessage = ! data.Profiles.length ? 'No matching results' : '';
                    this.setState({
                    loading: false,
                    results: data.Profiles,
                    message: cmessage,
                    currPage: this.state.currPage,
                    numPages: totalPages,
                    numResults: count

                }, () => {
                    console.log("after querystate");
                    console.log(this.state.results);
                    this.renderResults()}
                )})
                .catch((error) => this.setState({
                    loading: false,
                    results: {},
                    message: 'Network error'
                }));
        });

    // return await fetch('localhost:3000/Search/'+this.state.searchType+'/'+this.state.searchQuery.toString())
    // .then(response => response.json())
    // .then(data => {
    //     this.state.result = data;
    // });
    }


    updateInput = (e) => {
        e.preventDefault();
        console.log("input updated to:"+e.target.value);
        if(!e.target.value){
            console.log("restting state");
            this.setState({
                query: '',
                results: {},
                loading: false,
                message: '',
                currPage: 0,
                numPages: 0,
                numResults: 0
            })
        }
        else{
            this.setState({query: e.target.value}, () =>{
                this.querySearch();
            })
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
        if(this.clickedprofile == this.props.user.email){
            url = '/profile';
        }
        if (this.state.redirect) {
            return <Redirect to={url}/>
        }
    }
    
    renderResults = () => {
        console.log("rendering result");
        const {classes} = this.props;
        const {results} = this.state;
        const { user } = this.props;
        //console.log(Object.keys(results).length);
        if(Object.keys(results).length && results.length){
            var loop = 1;
            return(
                <List className={classes.root}>
                    {results.map(result => {
                        //console.log(result);
                        
                        let divider;
                        if(loop==results.length){
                            divider = '';
                        }
                        else{
                            divider = <Divider variant="inset" component="li" />;
                        }
                        console.log(loop+":"+results.length)
                        loop += 1;
                        var friend = <Friend user={user.email} stranger={result.Email} msg="true"/>;
                        var invite = <InviteButton email={result.Email}/>;
                        if(user.email == result.Email){
                            friend = null;
                            invite = null;
                        }
                        return(
                            //result.id
                            //result.avatar
                            //result.username
                            //result.status
                            <div key={result.Id} className="list-item">
                                <ListItem button alignItems="flex-start" onClick={() => this.redirectHandler(result.Email)}>
                                    <ListItemAvatar>
                                        <Avatar alt={result.Id} src={result.Avatar}/>
                                    </ListItemAvatar>
                                    <ListItemText
                                    primary={result.Username}
                                    secondary={
                                    <React.Fragment>
                                        {result.Status}
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
                                                {/* <IconButton edge="end" aria-label="PersonAdd">
                                                <PersonAddIcon />
                                                </IconButton> */}
                                                {invite}
                                                {friend}
                                            </Grid>
                                        </ListItemSecondaryAction>
                                </ListItem>
                                {divider}
                            </div>
                        )
                    })}
                </List>
            )
        }
    }

    render() {
        //const classes = this.props.classes;
        const {classes} = this.props;
        //const { query, loading, message, currentPageNo, totalPages } = this.state;
        const {query, loading, message, currPage, numPages} = this.state;
        console.log("in render"+query);
        console.log(loading);
        const pageBack = 1 < currPage;
        const pageNext = numPages > currPage;

        let pagination;
        if(this.state.numPages > 1){
            pagination = <Pagination count={numPages} page={currPage} onChange={this.handlePageChange}/>;
        }
        else{
            pagination = '';
        }

        return(
            <div className="container">
                {this.renderRedirect()}
                <h2 className="heading">Live Search</h2>
                <label className="search-label" htmlFor="search-input">
                    {/* <AppBar position="fixed" color="default" className={classes.appBar}> */}
                    <TextField 
                        className={classes.inputField}
                        type='text' 
                        value={query} 
                        id='search-input' 
                        placeholder='Search...' 
                        label='Search... ' 
                        onChange={this.updateInput}
                    />
                    {/* </AppBar> */}
                </label>

                {message && <p className="message">{message}</p>}
                {loading && <CircularProgress />}

                {this.renderResults()}
                {pagination}
{/* 
                <PageNavigation
                    loading={loading}
                    pageBack={pageBack}
                    pageNext={pageNext}
                    handleBack={() => this.handlePageClick(-1)}
                    handleNext={() => this.handlePageClick(1)}
                />
                {this.renderResults()}

                <PageNavigation
                    loading={loading}
                    pageBack={pageBack}
                    pageNext={pageNext}
                    handleBack={() => this.handlePageClick(-1)}
                    handleNext={() => this.handlePageClick(1)}
                /> */}
            </div>


            // <div className="container">
            //     <h2 className="heading">live search react</h2>
            //     <label className="search-label" htmlFor="search-input">
            //         <input
            //             type='text' 
            //             value='' 
            //             id='search-input' 
            //             placeholder='Search...'
            //         />
            //     </label>
            // </div>
        )
    }
}
// export default SearchBar
// export default() => {
//     const classes = useStyles();
//     console.log("bruh1");
//     return <SearchBar classes={classes} user123/>
// }
SearchBar.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(useStyles)(SearchBar);