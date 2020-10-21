import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { Button, TextField, Box, Grid, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, Input, Chip, Collapse, IconButton } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { doesEmailExist, createUserAccount } from "../../service/ApiCalls";
import CloseIcon from '@material-ui/icons/Close';

// TODO: make better
function SignUp() {
  let history = useHistory();
/*
  let signInHandler = () => {
    localStorage.setItem("auth", "letempass");
    history.push("/");
  };
*/
  var result

  const signInHandler = async () => {
    try {
      //history.replace('/')
      result = await doesEmailExist(email);
      if(!result) {
        createUserAccount(firstName, lastName, phoneNumber, email, password, document.getElementById("date-picker-dialog").value)
        setOpen(false);
      } else {
        setOpen(true);
      }
    } catch (err) {
      console.log(err)
    }
  };

  const [selectedDate, setSelectedDate] = React.useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const [firstName, setFirstName] = useState("");

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const [lastName, setlastName] = useState("");

  const handlelastNameChange = (event) => {
    setlastName(event.target.value);
  };

  const [phoneNumber, setphoneNumber] = useState("");

  const handlephoneNumberChange = (event) => {
    setphoneNumber(event.target.value);
  };

  const [email, setemail] = useState("");

  const handleemailChange = (event) => {
    setemail(event.target.value);
  };

  const [password, setpassword] = useState("");

  const handlepassword = (event) => {
    setpassword(event.target.value);
  };

  const names = [
    'Basketball',
    'Soccer',
    'Cricket',
    'Hockey',
    'Tennis',
    'Volleyball',
    'Baseball',
    'Rugby',
    'Golf',
    'Table Tennis',
  ];  
  const [personName, setPersonName] = React.useState([]);
  const handleChange = (event) => {
    setPersonName(event.target.value);
  };

  var letters = /^[A-Za-z]*$/;
  var numbers = /^[+\d]?(?:[\d-.\s()]*)$/;
  var emails = /^$|^.*@.*\..*$/;

  const [open, setOpen] = React.useState(false);

  return (
        <Box bgcolor="#000000" paddingTop="30px" textAlign='center' alignContent='center'
        paddingBottom="30px" paddingLeft="85px" paddingRight="85px" color="gray" fontSize="30px">
          <Grid container direction="row" justify="space-around" alignItems="center" spacing={3} >
            <Grid item xs>
              <Grid container direction="column" justify="space-around" alignItems="center" spacing={3} >
                <Grid item xs >
                  <p style={{fontSize:40}} >Register</p>
                </Grid>
                <Grid item xs>
                  <TextField style={{minWidth: 300}} id="first-name" label="First Name" variant="outlined" 
                    value={firstName}
                    onChange={handleFirstNameChange}
                    error={!firstName.match(letters)}
                    helperText={!firstName.match(letters) ? 'Only alphabets allowed!' : ' ' }
                  />
                </Grid>
                <Grid item xs>
                  <TextField style={{minWidth: 300}} id="lastName" label="Last Name" variant="outlined" 
                    value={lastName}
                    onChange={handlelastNameChange}
                    error={!lastName.match(letters)}
                    helperText={!lastName.match(letters) ? 'Only alphabets allowed!' : ' ' }                 
                  />
                </Grid>
                <Grid item xs>
                  <TextField style={{minWidth: 300}} id="phoneNumber" label="Phone Number" variant="outlined"
                    value={phoneNumber}
                    onChange={handlephoneNumberChange}
                    error={!phoneNumber.match(numbers)}
                    helperText={!phoneNumber.match(numbers) ? 'Invalid phone number!' : ' ' }                                     
                  />
                </Grid>
                <Grid item xs>
                  <TextField style={{minWidth: 300}} id="email" label="Email" variant="outlined" 
                    value={email}
                    onChange={handleemailChange}
                    //doesEmailExist(email)
                    //error={!doesEmailExist(email)}
                    //helperText={!doesEmailExist(email) ? 'Invalid email address!' : ' ' }
                    error={!email.match(emails)}
                    helperText={!email.match(emails) ? 'Invalid email address!' : ' ' }                                                         
                  />
                </Grid>
                <Grid item xs>
                  <TextField style={{minWidth: 300}} id="password" label="Password" variant="outlined" input type="password"
                    value={password}
                    onChange={handlepassword}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs>
              <Grid container direction="column" justify="space-around" alignItems="center" spacing={3} >
              <Grid item xs>
                <p style={{fontSize:30}}>Questions/Tags</p>
                </Grid>
                <Grid item xs>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker style={{minWidth: 300}}
                      //error={!isSet}
                      //helperText={isSet ? ' ' : ' ' }
                      inputVariant="outlined"
                      margin="normal"
                      id="date-picker-dialog"
                      label="Birthday"
                      format="MM/dd/yyyy"
                      value={selectedDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs>
                  <FormControl style={{minWidth: 300}} noValidate autoComplete="off" variant="outlined" key="test1"
                    //error={isSet}
                    //helperText={isSet ? ' fasdfdsa' : ' ' }
                  >
                    <InputLabel id="demo-simple-select-helper-label" key="test">Sport Level</InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="level-sport"
                      >
                        <MenuItem value={10}>No History</MenuItem>
                        <MenuItem value={20}>Recreational</MenuItem>
                        <MenuItem value={30}>High school</MenuItem>
                        <MenuItem value={20}>University</MenuItem>
                        <MenuItem value={20}>Professional</MenuItem>
                      </Select>
                  </FormControl>
                </Grid>
                <Grid item xs>
                <FormControl style={{minWidth: 300}} noValidate autoComplete="off" variant="outlined" >
                    <InputLabel id="demo-simple-select-helper-label">Favorite Sport</InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="fav-sport"
                      >
                        <MenuItem value={10}>Basketball</MenuItem>
                        <MenuItem value={20}>Soccer</MenuItem>
                        <MenuItem value={20}>Cricket</MenuItem>
                        <MenuItem value={20}>Hockey</MenuItem>
                        <MenuItem value={20}>Tennis</MenuItem>
                        <MenuItem value={20}>Volleyball</MenuItem>
                        <MenuItem value={20}>Baseball</MenuItem>
                        <MenuItem value={20}>Rugby</MenuItem>
                        <MenuItem value={20}>Golf</MenuItem>
                        <MenuItem value={30}>Table Tennis</MenuItem>
                      </Select>
                  </FormControl>
                </Grid>
                <Grid item xs>
                  <TextField style={{minWidth: 300}} id="fav-team" label="Favorite Team" variant="outlined" />
                </Grid>
                <Grid item xs>
                <FormControl style={{minWidth: 300, maxWidth: 300}} noValidate autoComplete="off" variant="outlined" >
                    <InputLabel id="demo-simple-select-helper-label">Sports You're Interested In</InputLabel>
                      <Select
                        labelId="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        value={personName}
                        onChange={handleChange}
                        input={<Input id="select-multiple-chip" />}
                        renderValue={(selected) => (
                          <div>
                            {selected.map((value) => (
                              <Chip key={value} label={value}/>
                            ))}
                          </div>
                        )}
                      >
                        {names.map((name) => (
                          <MenuItem key={name} value={name}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <br></br>
          <FormControlLabel
                    style={{minWidth: "25ch"}}
                    control={
                      <Checkbox
                        name="didSubscribe"
                        color="red"
                      />
                    }
                    label="I would like to receive the latest Sportcred news by email"
          />
          <br></br>
          <Button style={{minWidth: 300}} variant="contained" color="red" onClick={signInHandler}>
              Sign Up
          </Button>
          <br></br>
          <br></br>
          <Collapse in={open}>
            <Alert
              variant="outlined" severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              Email already exists
            </Alert>
          </Collapse>
        </Box>
  );
}

export default SignUp;
