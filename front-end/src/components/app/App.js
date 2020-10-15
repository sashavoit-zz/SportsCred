import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline, createMuiTheme } from "@material-ui/core";

import "./App.css";
import SignUp from "../sign-up/SignUp";
import LogIn from "../log-in/LogIn";
import Account from "../profile/Account";
import Profile from "../profile/Profile";
import PrivateRoute from "../routes/RestrictedRoute";


const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

// TODO: make better routing
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          {/* public routes */}
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/login" component={LogIn} />
          <Route exact path="/profile" component={Profile} />
          {/* private routes */}
          <PrivateRoute exact path="/" component={Account} />
          {/* Add new paths heres */}
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
