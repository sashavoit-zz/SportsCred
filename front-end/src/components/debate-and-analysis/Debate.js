import React from "react";
import { CircularProgress, Box, Typography, Card, CardContent, CardActions, Button, TextField, Grid, Backdrop, Avatar } from "@material-ui/core";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { question, answer, doesAnswerExist, getProfilePicLink } from "../../service/ApiCalls";
import { withRouter } from 'react-router-dom'

async function shouldRedirect(email, questionID) {
  var result = await doesAnswerExist(email, questionID);
  console.log(result)
  /*if(result) {
    //window.location.href = '../analysis';
    //history.push('/analysis')
  }*/
  return result;
}

export class Debate extends React.Component{

  constructor(props) {
    super(props);

    var dateOfMonth = new Date().getDate() % 10;
    shouldRedirect(this.props.user.email, "fanalyst" + dateOfMonth.toString())
      .then(
        (result) => {
          if(result) {
            this.props.history.push('/analysis')
          }
        })

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
    this.state = { profilePicLink: "" };
  }

  async goToAnalysis(email, answer1) {
    var dateOfMonth = new Date().getDate() % 10;
    await answer(email, "fanalyst" + dateOfMonth.toString(), answer1);
    this.props.history.push('/analysis')
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }
  
  async componentDidMount() {
    const dpLink = await getProfilePicLink(this.props.user.email)
    this.setState({ profilePicLink: await dpLink });
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

      if (this.state.percentTime == null) {
        return(
          <div>
            <Backdrop style={{ color: "green" }} open={true} >
              <CircularProgress />
            </Backdrop>
          </div>
        );
      }
      return(
          <div>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Question of the Day
                </Typography>
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={11}>
                    <Typography variant="h4" component="h2">
                      {this.state.questionOfTheDay}
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <CircularProgressbar
                      value={this.state.percentTime}
                      strokeWidth={50}
                      styles={buildStyles({
                        strokeLinecap: "butt", pathColor: "red"
                      })}
                    />
                  </Grid>
                </Grid>
                <br></br>
                <Box display="flex">
                  <Box p={1}>
                    <Avatar src={this.state.profilePicLink} width="60" height="60"/>
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
          </div>
      );
  }
}

export default withRouter(Debate);
