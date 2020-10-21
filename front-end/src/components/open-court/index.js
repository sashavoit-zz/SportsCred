import React, { Component } from "react";
import UploadPost from "./uploadPost"
import Feed from "./feed"
import SideBar from "../SideBar/SideBar";

export class openCourt extends React.Component{
    

    constructor(props) {
        super(props);
        this.state = {
            /**mock data for testing front end, will be deleted after finishing backend */
            posts:[
                {content:"mockcontent1mockcontent1",postTime:"27/08/2020",author:"mockauthor1", authorProfile: require("../../lib/profilePic.png"),likes:100, dislikes:29},
                {content:"mockcontent2mockcontent2", postTime:"29/09/2020",author:"mockauthor2", authorProfile: require("../../lib/profilePic.png"),likes:30, dislikes:9}
            ],
            /** TODO:The info of the currentUser should fetch from the db, here are some mock data */
            currentUser:{userName:"mockUser", email:"mock@gmail.com", profilePic:require("../../lib/profilePic.png")},
        };
    }

    render(){
        return(
            <div>
            <SideBar page="Open Court"/>
            <UploadPost component = {this}/>
            <Feed />
            </div>
        );
    }
}
export default openCourt;
