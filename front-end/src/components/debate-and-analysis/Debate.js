import React from "react";
import { CircularProgress, Box, Typography, Card, CardContent, CardActions, Button, TextField, Grid, Backdrop, Avatar } from "@material-ui/core";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { question, answer, doesAnswerExist, getProfilePicLink, getUserACS } from "../../service/ApiCalls";
import { withRouter } from 'react-router-dom'

async function shouldRedirect(email, questionID) {
  var result = await doesAnswerExist(email, questionID);
  console.log(result)
  return result;
}

export class Debate extends React.Component {

  constructor(props) {
    super(props);

    this.updateACS()
    var timeNext = new Date()
    timeNext.setDate(timeNext.getDate() + 1)
    timeNext.setHours(0, 0 ,0, 0)
    this.state = {
      time: new Date(timeNext - new Date()).toISOString().slice(11,19),
      percentTime: (timeNext - new Date())/864000,
      emailLoaded: false,
      value: '',
    }
    this.handleChange = this.handleChange.bind(this);
  }

  async goToAnalysis(email, answer1) {
    var dateOfMonth = new Date().getDate() % 10;
    console.log("answer: " + answer1)
    await answer(email, this.state.tier + dateOfMonth.toString(), answer1);
    this.props.history.push('/analysis')
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }
  
  async componentDidMount() {
    const dpLink = await getProfilePicLink(this.props.user.email)
    this.setState({ profilePicLink: await dpLink });
    
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    );
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  updateACS() {
    var dateOfMonth = new Date().getDate() % 10;
    getUserACS(this.props.user.email).then(
      (acs) => {
        if(acs<=300) {
          this.setState({tier: "fanalyst", tierPretty: "Fanalyst"})
        } else if(acs<=600) {
          this.setState({tier: "analyst", tierPretty: "Analyst"})
        } else if(acs<=900) {
          this.setState({tier: "proanalyst", tierPretty: "Pro Analyst"})
        } else {
          this.setState({tier: "expertanalyst", tierPretty: "Expert Analyst"})
        }
        shouldRedirect(this.props.user.email, this.state.tier + dateOfMonth.toString())
        .then(
          (result) => {
            if(result) {
              this.props.history.push('/analysis')
            }
          }
        );
        question(this.state.tier + dateOfMonth.toString()).then(
          (question) => {
            this.setState({ questionOfTheDay: question })
          }
        )
      }
    )
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user.email !== this.props.user.email) {
      this.setState({emailLoaded: true});
      this.updateACS();
    }
  }

  tick() {
    var timeNext = new Date()
    timeNext.setDate(timeNext.getDate() + 1)
    timeNext.setHours(0, 0 ,0, 0)
    this.setState({
      time: new Date(timeNext - new Date()).toISOString().slice(11,19),
      percentTime: (timeNext - new Date())/864000
    });
  }

  render(){
      if (this.state.questionOfTheDay == null || this.state.tier == null) {
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
                  {this.state.tierPretty}{" "}Question of the Day
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
                      text={this.state.time}
                      styles={buildStyles({
                        strokeLinecap: "butt", pathColor: "red", textColor: 'white',
                      })}>
                    </CircularProgressbar>
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
                        helperText={ this.state.value.length>=100 ? `${1000-this.state.value.length} characters left` : `${100-this.state.value.length} more characters at least`}
                        inputProps={{ maxLength: 1000 }}
                     />
                  </Box>
                </Box>
              </CardContent>
              <Box display="flex" justifyContent="flex-end" m={1}>
                <CardActions>
                  <Button variant="contained" color="primary"
                    disabled={this.state.value.length<=100}
                    onClick={(event) => this.goToAnalysis(this.props.user.email, this.state.value)}
                  > Debate</Button>
                </CardActions>
              </Box>
            </Card>
          </div>
      );
  }
}

export default withRouter(Debate);
