import React, { Component } from "react";
import UploadPost from "./uploadPost"
import Feed from "./feed"

export class openCourt extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            "firstName":"",
            "lastName":"",
            "test":"test"
        };
    }

    componentDidUpdate(){
        if(this.state.firstName.length == 0){
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Token": localStorage.getItem("Token"), 
                },
            };
            fetch("/getUserName/"+this.props.user.email,requestOptions)
                .then(response => response.json())
                .then((data) => {
                    this.setState({
                            firstName:data.firstName,
                            lastName:data.lastName
                    })
                })
                .catch(err => console.log(err))     
        }        
    }

    render(){
        const firstName =this.state.firstName;
        const lastName = this.state.lastName;
        return(
            <div>
            <UploadPost user={this.props.user} firstName={firstName} lastName = {lastName}/>
            <Feed />
            </div>
        );
    }
}
export default openCourt;
