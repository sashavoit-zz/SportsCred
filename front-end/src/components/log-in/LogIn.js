import React, { useState } from "react";
import { useHistory } from 'react-router-dom' 
import {
  makeStyles,
  Button,
  Typography,
  Grid,
  FormControl,
  TextField,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import lebrown from "../../assets/images/lebrown.jpg";
import { getAuthToken } from "../../service/ApiCalls";

function LogIn(props) {
  const classes = useStyles();
  const [formFields, setFormFields] = useState({ username: "", password: "" });
  const [authError, setAuthError] = useState(false);
  const history = useHistory()

  const handleLogin = async () => {
    try {
      await getAuthToken(formFields.username, formFields.password);
      history.replace('/')
    } catch (err) {
      console.log(err)
      setAuthError(true);
    }
  };

  const handleChange = (event, field) => {
    // TODO: update to use label instead of field
    let newVal = event.target.value;
    // console.log({ [field]: newVal });
    setFormFields((oldFields) => ({ ...oldFields, [field]: newVal }));
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      await handleLogin();
    }
  };

  return (
    <section style={sectionStyle}>
      <Grid
        container
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={6} />
        <Grid item xs={3}>
          <form className={classes.form}>
            <Grid item>
              <Typography variant="h2" style={{ marginBottom: "2vh" }}>
                Welcome Back!
              </Typography>
            </Grid>
            <Grid item>
              <FormControl variant="outlined">
                <TextField
                  error={authError}
                  type={"text"}
                  label="Username"
                  value={formFields.username}
                  onClick={() => setAuthError(false)}
                  onChange={(event) => handleChange(event, "username")}
                  variant="outlined"
                  InputProps={
                    authError
                      ? {
                          className: classes.inputError,
                        }
                      : null
                  }
                />
              </FormControl>
            </Grid>
            <Grid item style={{ marginBottom: 0 }}>
              <FormControl variant="outlined">
                <TextField
                  error={authError}
                  type={"password"}
                  label="Password"
                  endadornment={
                    <InputAdornment position="end">
                      <IconButton edge="end">{<VisibilityOff />}</IconButton>
                    </InputAdornment>
                  }
                  value={formFields.password}
                  onClick={() => setAuthError(false)}
                  onChange={(event) => handleChange(event, "password")}
                  onKeyDown={handleKeyDown}
                  variant="outlined"
                  InputProps={
                    authError
                      ? {
                          className: classes.inputError,
                        }
                      : null
                  }
                />
                <Grid item style={{ margin: 0, marginTop: "10px" }}>
                  <Button
                    size="small"
                    className={classes.margin}
                    style={{ textTransform: "none" }}
                  >
                    Forgot Something?
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
            <Grid justify="space-between" container>
              <Grid item>
                <Button
                  variant="outlined"
                  //onClick={handleSignUp} //TODO
                >
                  <span style={{ fontWeight: "600" }}>Sign Up</span>
                </Button>
              </Grid>
              <Grid item>
                <Button
                  className={classes.button}
                  variant="contained"
                  onClick={handleLogin}
                >
                  <span style={{ fontWeight: "600" }}>Log in</span>
                </Button>
              </Grid>
            </Grid>
          </form>
          <Grid item xs={3} />
        </Grid>
      </Grid>
    </section>
  );
}

var sectionStyle = {
  width: "100%",
  height: "100vh", // TODO: fix this, make it so its 100% of parent
  backgroundImage: `url(${lebrown})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

var useStyles = makeStyles((theme) => ({
  form: {
    padding: theme.spacing(2),
    "& label.Mui-focused": {
      color: "#c2adba",
    },
    "& .MuiGrid-item": {
      margin: theme.spacing(2),
    },
    "& .MuiOutlinedInput-root": {
      minWidth: "31ch",
      "&.Mui-focused fieldset": {
        borderColor: "#c2adba",
      },
    },
  },
  button: {
    "&:hover": {
      backgroundColor: "#fff",
    },
  },
  inputError: { color: "red" },
}));

export default LogIn;
