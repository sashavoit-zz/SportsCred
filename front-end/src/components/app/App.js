import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline, createMuiTheme } from "@material-ui/core";

import "./App.css";
import SignUp from "../sign-up/SignUp";
import Debate from "../debate-and-analysis/Debate"
import openCourt from '../open-court/index'
import LogIn from "../log-in/LogIn";
import Account from "../profile/Account";
import Trivia from '../trivia/Trivia'
import Profile from "../profile/Profile";
import PrivateRoute from "../routes/PrivateRoute";
import SideBar from "../SideBar/SideBar";
import SearchUser from '../UserService/SearchUser';
import OpenCourtPost from '../post/OpenCourtPost';
import VisitorOpenCourtPost from '../post/VisitorOpenCourtPost'; // should only contains GET methods
import Predictions from '../picks-n-predictions/Predictions'
import Analysis from "../debate-and-analysis/Analysis";
import User from "../profile/otherProfile";
import StrangerProfile from "../profile/ViewProfile";
import Leaderboards from "../leaderboards/Leaderboards";

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

// TODO: make better routing
function App() {
  let jwt = localStorage.getItem("Token");
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          {/* public routes */}
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/login" component={LogIn} />
          {!jwt && <Route exact path="/the-zone/:post" component={VisitorOpenCourtPost} />}
          {/* private routes */}
          <PrivateRoute exact path="/searchuser" component={SearchUser}/>
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/trivia" component={Trivia} />
          <PrivateRoute exact path="/the-zone" component={openCourt}/>
          {!!jwt && <PrivateRoute exact path="/the-zone/:post" component={OpenCourtPost} />}
          <PrivateRoute exact path="/predictions" component={Predictions}/>
          <PrivateRoute exact path="/debate" component={Debate}/>
          <PrivateRoute exact path="/analysis" component={Analysis}/>
          {!!jwt && <PrivateRoute exact path="/user/:email" component={StrangerProfile} />}
          <PrivateRoute exact path="/leaderboards" component={Leaderboards}/>
          {/* Add new paths heres */}
          <Route path="/" component={() => <Redirect to="/the-zone"/>} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
