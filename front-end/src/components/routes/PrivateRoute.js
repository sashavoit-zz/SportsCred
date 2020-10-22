import React, { useState } from "react";
import { useHistory, Route } from "react-router-dom";

import Dashboard from "../dashboard/Dashboard";
import { getUser } from "../../service/ApiCalls";

// TODO: make better
function PrivateRoute(props) {
  const { component: Component, routeProps } = props;
  const history = useHistory();
  const [user, setUser] = useState("");

  useState(async () => {
    let jwt = localStorage.getItem("Token");
    if (!jwt) {
      history.push("/login");
    }
    try {
      let username = await getUser();
      console.log(username);
      setUser(username);
    } catch (e) {
      console.log(e);
      history.push("/login");
    }
  }, []);

  return (
    <Route
      {...routeProps}
      render={(props) =>
        user && <Dashboard>
          <Component user={user}/>
        </Dashboard>
      }
    />
  );
}

export default PrivateRoute;
