import React from "react";
import SideBar from "../SideBar/SideBar";
import { CircularProgress, Box, Typography, Card, CardContent, CardActions, Slider, withStyles } from "@material-ui/core";
import pfp1 from '../../assets/images/pfp1.png';
import pfp2 from '../../assets/images/pfp2.png';
import pfp3 from '../../assets/images/pfp3.png';
import pfp4 from '../../assets/images/pfp4.png';
import fireimg from '../../assets/images/fire.png';
import thumbsdownimg from '../../assets/images/thumbsdown.png';
import { getUserAnswer, question, getRandomAnswers } from "../../service/ApiCalls";

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

const marks1 = [
  {
    value: 92,
    label: 'Avg',
  }
];

const marks2 = [
  {
    value: 79,
    label: 'Avg',
  }
];

const marks3 = [
  {
    value: 37,
    label: 'Avg',
  }
];

const marks4 = [
  {
    value: 62,
    label: 'Avg',
  }
];

export class Analysis extends React.Component{
  
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
    this.state = { userAnswer: "" };
    this.state = { userName: "" };

    this.state = { answer0: ""};
    this.state = { name0: ""};
    this.state = { email0: ""};

    this.state = { answer1: ""};
    this.state = { name1: ""};
    this.state = { email1: ""};

    this.state = { answer2: ""};
    this.state = { name2: ""};
    this.state = { email2: ""};

    this.state = { questionOfTheDay: "" };
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
    if (prevProps.user.email !== this.props.user.email) {
      var dateOfMonth = new Date().getDate() % 10;
      const answer = await getUserAnswer(this.props.user.email, "fanalyst" + dateOfMonth.toString())
      this.setState({ userAnswer: await answer[0] });
      this.setState({ userName: await answer[1] });

      const answers = await getRandomAnswers("fanalyst" + dateOfMonth.toString())
      this.setState({ answer0: await answers[0] });
      this.setState({ name0: await answers[1] });
      this.setState({ email0: await answers[2] });

      this.setState({ answer1: await answers[3] });
      this.setState({ name1: await answers[4] });
      this.setState({ email1: await answers[5] });

      this.setState({ answer2: await answers[6] });
      this.setState({ name2: await answers[7] });
      this.setState({ email2: await answers[8] });

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
      return(
          <div>
            <SideBar page="Debate & Analysis"/>
            <Typography color="textSecondary" gutterBottom>
              Question of the Day
            </Typography>
            <Typography variant="h4" component="h2">
              {this.state.questionOfTheDay}
            </Typography>
            <br></br>
            <br></br>
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
            <Card hidden={this.state.answer0=="" || this.state.answer0==this.state.userAnswer}>
              <CardContent>
                <Box display="flex">
                  <Box p={1}>
                    <img src={pfp3} width="50" height="50"/>
                  </Box>
                  <Box p={1} flexGrow={1}>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                      {this.state.name0}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {this.state.answer0}
                    </Typography>
                  </Box>
                  <Box>
                    <img src={fireimg} width="30" height="30"/>
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
                      marks={marks1}
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
            <br></br>
            <Card hidden={this.state.answer1=="" || this.state.answer1==this.state.userAnswer}>
              <CardContent>
                <Box display="flex">
                  <Box p={1}>
                    <img src={pfp2} width="50" height="50"/>
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
                      marks={marks2}
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
            <br></br>
            <Card hidden={this.state.answer2=="" || this.state.answer2==this.state.userAnswer}>
              <CardContent>
                <Box display="flex">
                  <Box p={1}>
                    <img src={pfp4} width="50" height="50"/>
                  </Box>
                  <Box p={1} flexGrow={1}>
                    <Typography color="textSecondary" gutterBottom variant="h6" >
                      {this.state.name2}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                    {this.state.answer2}
                    </Typography>
                  </Box>
                  <Box>
                    <img src={thumbsdownimg} width="30" height="30"/>
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
                      marks={marks3}
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
                    <img src={pfp1} width="50" height="50"/>
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
                  <Box p={1}>
                    <Typography color="textSecondary" gutterBottom>
                      Disagree
                    </Typography>
                  </Box>
                  <Box p={1} flexGrow={1}>
                    <HotSlider
                      aria-label="hot-slider"
                      marks={marks4}
                      value="62"
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
          </div>
      );
  }
}

export default Analysis;
