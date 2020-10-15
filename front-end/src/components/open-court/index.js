import React, { Component } from "react";
import Feed from "./feed"

export class openCourt extends React.Component{
    /* TODO:the posts in the state should fetch from the db, here are some dummy data */

    constructor(props) {
        super(props);
        this.state = {
            /** TODO:The info of the currentUser should fetch from the db, here are some mock data */
            currentUser:{userName:"mockCurrentUser", email:"mock@gmail.com", profilePic:require("../../lib/profilePic.png")}
        };
    }

    render(){
        return(
            <Feed />
        );
    }
}
export default openCourt;