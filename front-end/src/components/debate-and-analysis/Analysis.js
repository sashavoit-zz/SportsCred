import React from "react";
import { CircularProgress, Box, Typography, Card, CardContent, Grid, Slider, withStyles, Backdrop, LinearProgress, Avatar } from "@material-ui/core";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { getUserAnswer, question, getRandomAnswers, getRating, getUsersRating, addRating, getProfilePicLink } from "../../service/ApiCalls";

const HotSlider = withStyles({
  root: {
    color: "red",
    height: 8
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "red",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit"
    }
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)"
  },
  track: {
    height: 8,
    borderRadius: 4
  },
  rail: {
    height: 8,
    borderRadius: 4
  },
  mark: {
    //backgroundColor: '#bfbfbf',
    height: 15,
    width: 3,
    marginTop: -3,
  },
  markActive: {
    opacity: 1,
    backgroundColor: 'currentColor',
  },
})(Slider);

export class Analysis extends React.Component{
  
  constructor(props) {
    super(props);
    var timeNext = new Date()
    timeNext.setDate(timeNext.getDate() + 1)
    timeNext.setHours(0, 0 ,0, 0)
    this.state = {
      time: new Date(timeNext - new Date()).toISOString().slice(11,19),
      percentTime: (timeNext - new Date())/864000,
      userAnswer: "",
      userName: "",
      userRating: 100,
      answer0: "",
      name0: "",
      email0: "",
      answer1: "",
      name1: "",
      email1: "",
      answer2: "",
      name2: "",
      email2: "",
      questionOfTheDay: "",
      marks1:[{ value: 100, label: 'Avg: 100%' }],
      marks2:[{ value: 100, label: 'Avg: 100%' }], 
      marks3:[{ value: 100, label: 'Avg: 100%' }],
      rate1: null,
      rate2: null,
      rate3: null,
      updateOnce: true,
      profilePicLink: "",
      dpLink1: "",
      dpLink2: "",
      dpLink3: "",
    };
  }

  async sendRating1(rate) {
    var dateOfMonth = new Date().getDate() % 10;
    const rating = await addRating("fanalyst" + dateOfMonth.toString(), this.state.email0, this.props.user.email, rate);
    this.setState({ marks1:[{ value: rating, label: 'Avg: '+Math.round(rating) +'%'}] })
  }

  async sendRating2(rate) {
    var dateOfMonth = new Date().getDate() % 10;
    const rating = await addRating("fanalyst" + dateOfMonth.toString(), this.state.email1, this.props.user.email, rate);
    this.setState({ marks2:[{ value: rating, label: 'Avg: '+Math.round(rating)+'%'}] })
  }

  async sendRating3(rate) {
    var dateOfMonth = new Date().getDate() % 10;
    const rating = await addRating("fanalyst" + dateOfMonth.toString(), this.state.email2, this.props.user.email, rate);
    this.setState({ marks3:[{ value: rating, label: 'Avg: '+Math.round(rating)+'%'}] })
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
  async componentDidUpdate(prevProps) {

    if (prevProps.user.email !== this.props.user.email || this.state.updateOnce) {
      this.setState({ updateOnce: false })

      var dateOfMonth = new Date().getDate() % 10;
      const dpLink = await getProfilePicLink(this.props.user.email)
      const answer = await getUserAnswer(this.props.user.email, "fanalyst" + dateOfMonth.toString())
      const usersRating = await getRating(this.props.user.email, "fanalyst" + dateOfMonth.toString())
      this.setState({ userAnswer: await answer[0] });
      this.setState({ userName: await answer[1] });
      this.setState({ userRating: usersRating })
      this.setState({ profilePicLink: await dpLink });

      const answers = await getRandomAnswers("fanalyst" + dateOfMonth.toString())
      const rating0 = await getRating(answers[2], "fanalyst" + dateOfMonth.toString())
      const dpLink1 = await getProfilePicLink(answers[2])
      const rateFromDB0 = await getUsersRating("fanalyst" + dateOfMonth.toString(), answers[2], this.props.user.email)
      this.setState({ answer0: await answers[0] });
      this.setState({ name0: await answers[1] });
      this.setState({ email0: await answers[2] });
      this.setState({ marks1:[{ value: rating0, label: 'Avg: '+Math.round(rating0)+'%'}] })
      this.setState({ rate1: await rateFromDB0 })
      this.setState({ dpLink1: await dpLink1 });

      const rating1 = await getRating(answers[5], "fanalyst" + dateOfMonth.toString())
      const dpLink2 = await getProfilePicLink(answers[5])
      const rateFromDB1 = await getUsersRating("fanalyst" + dateOfMonth.toString(), answers[5], this.props.user.email)
      this.setState({ answer1: await answers[3] });
      this.setState({ name1: await answers[4] });
      this.setState({ email1: await answers[5] });
      this.setState({ marks2:[{ value: rating1, label: 'Avg: '+Math.round(rating1)+'%'}] })
      this.setState({ rate2: await rateFromDB1 })
      this.setState({ dpLink2: await dpLink2 });

      const rating2 = await getRating(answers[8], "fanalyst" + dateOfMonth.toString())
      const dpLink3 = await getProfilePicLink(answers[8])
      const rateFromDB2 = await getUsersRating("fanalyst" + dateOfMonth.toString(), answers[8], this.props.user.email)
      this.setState({ answer2: await answers[6] });
      this.setState({ name2: await answers[7] });
      this.setState({ email2: await answers[8] });
      this.setState({ marks3:[{ value: rating2, label: 'Avg: '+Math.round(rating2)+'%'}] })
      this.setState({ rate3: await rateFromDB2 })
      this.setState({ dpLink3: await dpLink3 });

    }
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
  
    if (this.state.percentTime == null || this.state.rate3 == null) {
      return(
        <div>
          <Backdrop style={{ color: "green" }} open={true} >
            <CircularProgress />
          </Backdrop>
        </div>
      );
    }

    const handleChangeCommitted1 = (event, newValue) => {
      this.sendRating1(newValue);
    };
    const handleChangeCommitted2 = (event, newValue) => {
      this.sendRating2(newValue);
    };
    const handleChangeCommitted3 = (event, newValue) => {
      this.sendRating3(newValue);
    };

        return(
          <div>
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
            <Card hidden={this.state.answer0=="" || this.state.answer0==this.state.userAnswer}>
              <CardContent>
                <Box display="flex">
                  <Box p={1}>
                    <Avatar src={this.state.dpLink1} width="60" height="60"/>
                  </Box>
                  <Box p={1} flexGrow={1}>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                      {this.state.name0}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {this.state.answer0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardContent>
                <Box display="flex">
                  <Box p={1}>
                    <Typography color="textSecondary" gutterBottom>
                      Disagree
                    </Typography>
                  </Box>
                  <Box p={1} flexGrow={1}>
                    <HotSlider
                      aria-label="hot-slider"
                      marks={this.state.marks1}
                      valueLabelDisplay="auto"
                      onChangeCommitted={handleChangeCommitted1}
                    />
                  </Box>
                  <Box p={1}>
                    <Typography color="textSecondary" gutterBottom>
                      Agree
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            <br></br>
            <Card hidden={this.state.answer1=="" || this.state.answer1==this.state.userAnswer}>
              <CardContent>
                <Box display="flex">
                  <Box p={1}>
                    <Avatar src={this.state.dpLink2} width="60" height="60"/>
                  </Box>
                  <Box p={1} flexGrow={1}>
                    <Typography color="textSecondary" gutterBottom variant="h6" >
                      {this.state.name1}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {this.state.answer1}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardContent>
                <Box display="flex">
                  <Box p={1}>
                    <Typography color="textSecondary" gutterBottom>
                      Disagree
                    </Typography>
                  </Box>
                  <Box p={1} flexGrow={1}>
                    <HotSlider
                      aria-label="hot-slider"
                      marks={this.state.marks2}
                      valueLabelDisplay="auto"
                      onChangeCommitted={handleChangeCommitted2}
                    />
                  </Box>
                  <Box p={1}>
                    <Typography color="textSecondary" gutterBottom>
                      Agree
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            <br></br>
            <Card hidden={this.state.answer2=="" || this.state.answer2==this.state.userAnswer}>
              <CardContent>
                <Box display="flex">
                  <Box p={1}>
                    <Avatar src={this.state.dpLink3} width="60" height="60"/>
                  </Box>
                  <Box p={1} flexGrow={1}>
                    <Typography color="textSecondary" gutterBottom variant="h6" >
                      {this.state.name2}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                    {this.state.answer2}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardContent>
                <Box display="flex">
                  <Box p={1}>
                    <Typography color="textSecondary" gutterBottom>
                      Disagree
                    </Typography>
                  </Box>
                  <Box p={1} flexGrow={1}>
                    <HotSlider
                      aria-label="hot-slider"
                      marks={this.state.marks3}
                      valueLabelDisplay="auto"
                      onChangeCommitted={handleChangeCommitted3}
                    />
                  </Box>
                  <Box p={1}>
                    <Typography color="textSecondary" gutterBottom>
                      Agree
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            <br></br>
            <Typography color="textSecondary" gutterBottom hidden={this.state.userAnswer==""}>
              Your Post
            </Typography>
            <br></br>
            <Card hidden={this.state.userAnswer==""}>
              <CardContent>
                <Box display="flex">
                  <Box p={1}>
                    <Avatar src={this.state.profilePicLink} width="60" height="60"/>
                  </Box>
                  <Box p={1} flexGrow={1}>
                    <Typography color="textSecondary" gutterBottom variant="h6" >
                      {this.state.userName}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {this.state.userAnswer}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardContent>
                <Box display="flex">
                  <Box p={1} flexGrow={1}>
                    <LinearProgress value={this.state.userRating} variant="determinate" />
                  </Box>
                  <Box p={1}>
                    <Typography color="textSecondary" gutterBottom>
                      {Math.round(this.state.userRating)}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </div>
      );
  }
}

export default Analysis;
