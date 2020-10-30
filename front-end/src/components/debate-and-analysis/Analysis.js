import React from "react";
import SideBar from "../SideBar/SideBar";
import { CircularProgress, Box, Typography, Card, CardContent, CardActions, Slider, withStyles } from "@material-ui/core";
import pfp1 from '../../assets/images/pfp1.png';
import pfp2 from '../../assets/images/pfp2.png';
import pfp3 from '../../assets/images/pfp3.png';
import pfp4 from '../../assets/images/pfp4.png';
import fireimg from '../../assets/images/fire.png';
import thumbsdownimg from '../../assets/images/thumbsdown.png';

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
            <Typography color="textSecondary" gutterBottom>
              Question of the Day
            </Typography>
            <Typography variant="h4" component="h2">
              Who is the greatest of all time?
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
            <Card>
              <CardContent>
                <Box display="flex">
                  <Box p={1}>
                    <img src={pfp3} width="50" height="50"/>
                  </Box>
                  <Box p={1} flexGrow={1}>
                    <Typography color="textSecondary" gutterBottom>
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
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
            <Card>
              <CardContent>
                <Box display="flex">
                  <Box p={1}>
                    <img src={pfp2} width="50" height="50"/>
                  </Box>
                  <Box p={1} flexGrow={1}>
                    <Typography color="textSecondary" gutterBottom>
                      At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
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
            <Card>
              <CardContent>
                <Box display="flex">
                  <Box p={1}>
                    <img src={pfp4} width="50" height="50"/>
                  </Box>
                  <Box p={1} flexGrow={1}>
                    <Typography color="textSecondary" gutterBottom>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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
            <br></br>
            <Typography color="textSecondary" gutterBottom>
              Your Post
            </Typography>
            <br></br>
            <Card>
              <CardContent>
                <Box display="flex">
                  <Box p={1}>
                    <img src={pfp1} width="50" height="50"/>
                  </Box>
                  <Box p={1} flexGrow={1}>
                    <Typography color="textSecondary" gutterBottom>
                      Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
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
