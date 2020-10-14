import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Typography } from "@material-ui/core";

// TODO: make better
function SignUp() {
  let history = useHistory();

  let signInHandler = () => {
    localStorage.setItem("auth", "letempass");
    history.push("/");
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Sports Cred
      </Typography>
      <Button variant="contained" color="primary" onClick={signInHandler}>
        Sign In
      </Button>
    </>
  );
}

export default SignUp;
