import React from "react";
import lebrown from "../../assets/images/lebrown.jpg";
import {
  makeStyles,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Grid,
  TextField,
  FormControl,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import FilledInput from "@material-ui/core/FilledInput";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

var sectionStyle = {
  width: "100%",
  height: "100vh", // TODO: fix this, make it so its 100% of parent
  backgroundImage: `url(${lebrown})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: "60%",
    // backgroundColor: "inherit",
    background:
      "-webkit-gradient(linear, left top, left bottom, color-stop(0%,#404041), color-stop(33%,#272727), color-stop(66%,#0a0e0a), color-stop(100%,#0a0809))",
  },
  form: {
    padding: theme.spacing(2),
    "& label.Mui-focused": {
      color: "#f1de92",
    },
    "& .MuiGrid-item": {
      margin: theme.spacing(2),
    },
    "& .MuiOutlinedInput-root": {
      maxWidth: "25ch",
      "&.Mui-focused fieldset": {
        borderColor: "#f1de92",
      },
    },
  },
}));

function LogIn(props) {
  const classes = useStyles();
  return (
    <section style={sectionStyle}>
      <Grid
        container
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
        xs={6}
      >
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h3"></Typography>
          </CardContent>
          <form className={classes.form}>
            <Grid item>
              <FormControl variant="outlined">
                <InputLabel>Username</InputLabel>
                <OutlinedInput type={"text"} labelWidth={75} />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl variant="outlined">
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  type={"password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton edge="end">{<VisibilityOff />}</IconButton>
                    </InputAdornment>
                  }
                  labelWidth={70}
                />
              </FormControl>
            </Grid>
          </form>
        </Card>
      </Grid>
    </section>
  );
}

export default LogIn;
