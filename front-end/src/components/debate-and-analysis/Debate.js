import React from "react";
import SideBar from "../SideBar/SideBar";
import { CircularProgress, Box, Typography, Card, CardContent, CardActions, Button, TextField, } from "@material-ui/core";
import pfp1 from '../../assets/images/pfp1.png';
import { question, answer, doesAnswerExist } from "../../service/ApiCalls";

async function shouldRedirect(email, questionID) {
  var result = await doesAnswerExist(email, questionID);
  if(result) {
    window.location.href = '../analysis';
  }
}

export class Debate extends React.Component{

  constructor(props) {
    super(props);

    var dateOfMonth = new Date().getDate() % 10;
    shouldRedirect(this.props.user.email, "fanalyst" + dateOfMonth.toString());

    var timeNext = new Date()
    timeNext.setDate(timeNext.getDate() + 1)
    timeNext.setHours(0, 0 ,0, 0)
    this.state = {
      time: new Date(timeNext - new Date()).toISOString().slice(11,19)
    };
    this.state = {
      percentTime: (timeNext - new Date())/864000
    };
    this.state = { questionOfTheDay: "" };

    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.state = { emailLoaded: false };
  }

  async goToAnalysis(email, answer1) {
    var dateOfMonth = new Date().getDate() % 10;
    await answer(email, "fanalyst" + dateOfMonth.toString(), answer1);
    window.location.href = '../analysis';
  }  

  handleChange(event) {
    this.setState({value: event.target.value});
  }
  
  async componentDidMount() {
    var dateOfMonth = new Date().getDate() % 10;
    const question1 = await question("fanalyst" + dateOfMonth.toString())
    this.setState({ questionOfTheDay: await question1 });
    
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    );
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user.email !== this.props.user.email) {
      this.setState({emailLoaded: true});
      var dateOfMonth = new Date().getDate() % 10;
      shouldRedirect(this.props.user.email, "fanalyst" + dateOfMonth.toString());
    }
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
    let email = this.props.user.email;
      return(
          <div>
          <SideBar page="Debate & Analysis"/>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Question of the Day
                </Typography>
                <Typography variant="h4" component="h2">
                  {this.state.questionOfTheDay}
                </Typography>
                <br></br>
                <Box display="flex">
                  <Box p={1}>
                    <img src={pfp1} width="50" height="50"/>
                  </Box>
                  <Box p={1} flexGrow={1}>
                    <TextField
                        id="outlined-multiline-static"
                        label="Your answer"
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth="true"
                        value={this.state.value}
                        onChange={this.handleChange}
                     />
                  </Box>
                </Box>
              </CardContent>
              <Box display="flex" justifyContent="flex-end" m={1}>
                <CardActions>
                  <Button variant="contained" color="primary"
                    onClick={(event) => this.goToAnalysis(email, this.state.value)}
                  > Debate</Button>
                </CardActions>
              </Box>
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

export default Debate;
