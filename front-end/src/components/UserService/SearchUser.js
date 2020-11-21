//import React from "react";
import React from 'react';
import SearchBar from '../shared/SearchBar';

import SideBar from "../SideBar/SideBar";
import Table from "../shared/Table";

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import TextField from '@material-ui/core/TextField';
import FaceIcon from '@material-ui/icons/Face';


// TODO: make better
export class SearchUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: []
        }
      }
    
    render() {
        const { classes } = this.props;
        const { user } = this.props;
        return (
            <SearchBar user={user}></SearchBar>
            //"hello"
        );
    }
}
  
  export default SearchUser;