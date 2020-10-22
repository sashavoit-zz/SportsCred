import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline, createMuiTheme } from "@material-ui/core";

import "./App.css";
import SignUp from "../sign-up/SignUp";
import openCourt from '../open-court/index'
import LogIn from "../log-in/LogIn";
import Account from "../profile/Account";
import Trivia from '../trivia/Trivia'
import Profile from "../profile/Profile";
import PrivateRoute from "../routes/PrivateRoute";
import SideBar from "../SideBar/SideBar";
import SearchUser from '../UserService/SearchUser';


// TODO: make better routing
function App() {
  return (
    <div className="App-header">
      <SideBar page = "Trivia"></SideBar>
      <Router>
        <Switch>
          {/* public routes */}
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/login" component={LogIn} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/searchuser" component={SearchUser}/>
          {/* private routes */}
          <PrivateRoute exact path="/" component={Account} />
          {/* Add new paths heres */}
          <Route exact path="/trivia" component={Trivia}/>
          <Route exact path="/openCourt" component={openCourt}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
