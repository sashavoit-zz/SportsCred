import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import "./App.css";
import SignUp from '../sign-up/SignUp'
import openCourt from '../open-court/index'


function App() {
  return (
    <div className="App-header">
      <Router>
        <Switch>
          <Route exact path="/" component={SignUp}/>
          {/* Add new paths heres */}
          <Route exact path="/openCourt" component={openCourt}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
