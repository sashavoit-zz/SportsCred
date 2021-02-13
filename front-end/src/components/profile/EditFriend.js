import React from 'react';
import {Typography, IconButton,Avatar} from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

const url = 'http://go:3001';

class EditFriend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            friend: false
        }
    }

    handleFriend = (e) => {
        e.preventDefault();
        this.reqFriend();
        console.log(this.props.user + "bruh:"+this.props.stranger);
    }

    componentDidMount = () => {
        this.getFriend();
    }
    
    getFriend = async () => {
        var query = url+'isfriend?user='+this.props.user+'&stranger='+this.props.stranger;
        const req = new Request(query, {
            method: 'GET'
        });
        fetch(req)
            .then(response => response.json())
            .then(data => (this.setState({friend: data}, () => {console.log("new friend state"+this.state.friend)})))
    }

    reqFriend = async () => {
        var friendurl = url+'friend/'+this.props.user+'/add/'+this.props.stranger;
        const req = new Request(friendurl, {
            method:'PUT'
        });
        fetch(req)
            .then(() => {this.getFriend();})
    }

    render(){
        const {msg} = this.props;
        var message = <Typography>{"Add Friend"}</Typography>
        var icon = <PersonAddIcon/>
        if(this.state.friend){
            message = <Typography color="error">{"Remove Friend"}</Typography>
            icon = <RemoveCircleIcon color="error"/>
        }
        if(msg && msg == "false"){
            message = null;
        }
        return(
            <div disableSpacing>
                <IconButton onClick={this.handleFriend}>
                    {icon}
                    {message}
                </IconButton>
            </div>
        )
    }
}

export default EditFriend;