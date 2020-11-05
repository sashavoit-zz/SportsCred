import React, { useState } from "react";
import { useHistory, Route } from "react-router-dom";

import Dashboard from "../dashboard/Dashboard";
import { getUser } from "../../service/ApiCalls";

// TODO: make better
function PrivateRoute(props) {
  const { component: Component, routeProps } = props;
  const history = useHistory();
  const [user, setUser] = useState({ email: '' });
  const param = props.computedMatch.params.post;

  useState(async () => {
    let jwt = localStorage.getItem("Token");
    if (!jwt) {
      history.push("/login");
    }
    try {
      let email = await getUser();
      console.log(email);
      setUser({ email });
    } catch (e) {
      console.log(e);
      localStorage.removeItem("Token")
      history.push("/login");
    }
  }, []);

  return (
    <Route
      {...routeProps}
      render={(props) =>
        user && <Dashboard>
          <Component user={user} param={param}/>
        </Dashboard>
      }
    />
  );
}

export default PrivateRoute;
