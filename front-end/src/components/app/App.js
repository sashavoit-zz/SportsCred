import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import "./App.css";
import SignUp from '../sign-up/SignUp'
import Account from '../profile/Account'
import Profile from '../profile/Profile'
import PrivateRoute from '../routes/RestrictedRoute'

// TODO: make better routing
function App() {
  return (
    <div className="App-header">
      <Router>
        <Switch>
          {/* public routes */}
          <Route exact path="/signup" component={SignUp}/>
          <Route exact path="/profile" component={Profile}/>
          {/* private routes */}
          <PrivateRoute exact path="/" component={Account}/>
          {/* Add new paths heres */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
