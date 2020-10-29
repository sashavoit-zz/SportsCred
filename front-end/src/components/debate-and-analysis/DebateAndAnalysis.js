import React from "react";
import SideBar from "../SideBar/SideBar";
import { CircularProgress, Box, Typography, Card, CardContent, CardActions, Button, TextField } from "@material-ui/core";

export class DebateAndAnalysis extends React.Component{
  constructor(props) {
    super(props);
    var timeNext = new Date()
    timeNext.setDate(timeNext.getDate() + 1)
    timeNext.setHours(0, 0 ,0, 0)
    this.state = {
      time: new Date(timeNext - new Date()).toISOString().slice(11,19)
    };
    this.state = {
      percentTime: (timeNext - new Date())/864000
    };
  }

  componentDidMount() {
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    );
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }
  tick() {
    var timeNext = new Date()
    timeNext.setDate(timeNext.getDate() + 1)
    timeNext.setHours(0, 0 ,0, 0)
    this.setState({
      time: new Date(timeNext - new Date()).toISOString().slice(11,19)
    });
    this.setState({
      percentTime: (timeNext - new Date())/864000
    });
  }

  render(){
      return(
          <div>
          <SideBar page="Debate & Analysis"/>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Question of the Day
                </Typography>
                <Typography variant="h4" component="h2">
                  Who is the greatest of all time?
                </Typography>
                <br></br>
                <TextField
                  id="outlined-multiline-static"
                  label="Your answer"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth="true"
                />
              </CardContent>
              <CardActions>
                <Button variant="contained" color="primary" > Debate</Button>
              </CardActions>
            </Card>
            <Box position="absolute" top="80px" right="40px" display="inline-flex" height="90px" width="90px" >
              <CircularProgress variant="static" value={this.state.percentTime} size="90px" />
              <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography color="textSecondary" gutterBottom>
                  {this.state.time}
                </Typography>
              </Box>
            </Box>
          </div>
      );
  }
}

export default DebateAndAnalysis;
