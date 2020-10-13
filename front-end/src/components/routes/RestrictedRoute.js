import React from "react";
import { Redirect, Route } from "react-router-dom";

import Dashboard from "../dashboard/Dashboard";

// TODO: make better
function RestrictedRoute(props) {
  const { component: Component, routeProps } = props;
  return (
    <Route
      {...routeProps}
      render={(props) =>
        localStorage.getItem("auth") ? (
          <Dashboard>
            <Component {...props} />
          </Dashboard>
        ) : (
          <Redirect
            to={{
              pathname: "/signup",
            }}
          />
        )
      }
    />
  );
}

export default RestrictedRoute;
