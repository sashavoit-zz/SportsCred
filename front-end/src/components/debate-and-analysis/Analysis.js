import React from "react";
import { CircularProgress, Box, Typography, Card, CardContent, Grid, Backdrop, LinearProgress, Avatar } from "@material-ui/core";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { UserPost } from "./UserPost"
import { getUserAnswer, question, getRandomAnswers, getRating, getUsersRating, getProfilePicLink, getUserACS } from "../../service/ApiCalls";

export class Analysis extends React.Component{
  
  constructor(props) {
    super(props);

    var timeNext = new Date()
    timeNext.setDate(timeNext.getDate() + 1)
    timeNext.setHours(0, 0 ,0, 0)
    
    this.state = {
      time: new Date(timeNext - new Date()).toISOString().slice(11,19),
      percentTime: (timeNext - new Date())/864000,
      updateOnce: true,
      answersLoaded: false,
    };

  }

  async componentDidMount() {
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    );
  }

  async componentDidUpdate(prevProps) {

    if (prevProps.user.email !== this.props.user.email || this.state.updateOnce) {
      this.setState({ updateOnce: false})

      var acs = await getUserACS(this.props.user.email)
      var tier
      if(acs<=300) {
        tier="fanalyst"
        this.setState({tierPretty: "Fanalyst"})
      } else if(acs<=600) {
        tier="analyst"
        this.setState({tierPretty: "Analyst"})
      } else if(acs<=900) {
        tier="proanalyst"
        this.setState({tierPretty: "Pro Analyst"})
      } else {
        tier="expertanalyst"
        this.setState({tierPretty: "Expert Analyst"})
      }

      var dateOfMonth = new Date().getDate() % 10;
      const question1 = await question(tier + dateOfMonth.toString())
      this.setState({ questionOfTheDay: await question1 });  
      const answers = await getRandomAnswers(tier + dateOfMonth.toString())

      if(answers[2]!=="") {
        const rating0 = await getRating(answers[2], tier + dateOfMonth.toString())
        const dpLink1 = await getProfilePicLink(answers[2])
        const rateFromDB0 = await getUsersRating(tier + dateOfMonth.toString(), answers[2], this.props.user.email)
        const userACS1 = await getUserACS(answers[2])
        this.setState({
          answer0: await answers[0],
          name0: await answers[1],
          email0: await answers[2],
          marks1:[{ value: rating0, label: 'Avg: '+Math.round(rating0)+'%'}],
          rate1: await rateFromDB0,
          dpLink1: dpLink1,
          userACS1: userACS1,
        });
      }

      if(answers[5]!=="") {
        const rating1 = await getRating(answers[5], tier + dateOfMonth.toString())
        const dpLink2 = await getProfilePicLink(answers[5])
        const rateFromDB1 = await getUsersRating(tier + dateOfMonth.toString(), answers[5], this.props.user.email)
        const userACS2 = await getUserACS(answers[5])
        this.setState({
          answer1: await answers[3],
          name1: await answers[4],
          email1: await answers[5],
          marks2:[{ value: rating1, label: 'Avg: '+Math.round(rating1)+'%'}],
          rate2: await rateFromDB1,
          dpLink2: await dpLink2,
          userACS2: userACS2,
        });
      }

      if(answers[8]!=="") {
        const rating2 = await getRating(answers[8], tier + dateOfMonth.toString())
        const dpLink3 = await getProfilePicLink(answers[8])
        const rateFromDB2 = await getUsersRating(tier + dateOfMonth.toString(), answers[8], this.props.user.email)
        const userACS3 = await getUserACS(answers[8])
        this.setState({
          answer2: await answers[6],
          name2: await answers[7],
          email2: await answers[8],
          marks3:[{ value: rating2, label: 'Avg: '+Math.round(rating2)+'%'}],
          rate3: await rateFromDB2,
          dpLink3: await dpLink3,
          userACS3: userACS3,
        });
      }

      const dpLink = await getProfilePicLink(this.props.user.email)
      const answer = await getUserAnswer(this.props.user.email, tier + dateOfMonth.toString())
      const usersRating = await getRating(this.props.user.email, tier + dateOfMonth.toString())
      const userACS = await getUserACS(this.props.user.email).then(
        this.setState({answersLoaded: true})
      )
      this.setState({
        userAnswer: await answer[0],
        userName: await answer[1],
        userRating: usersRating,
        profilePicLink: dpLink,
        currentUserACS: userACS,
       });

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
  
    if (this.state.percentTime == null || !this.state.answersLoaded) {
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
                      })}
                    />
                  </Grid>
                </Grid>
            <br></br>
            <div hidden={!this.state.answer0 || this.state.answer0==="" || this.state.email0===this.props.user.email}>
              <UserPost rating={this.state.rating0} name={this.state.name0} answer={this.state.answer0}
                marks={this.state.marks1} posterEmail={this.state.email0} dpLink={this.state.dpLink1}
                raterEmail={this.props.user.email} acs={this.state.userACS1}
              />
            </div>
            <br></br>
            <div hidden={!this.state.answer1 || this.state.answer1==="" || this.state.email1===this.props.user.email}>
              <UserPost rating={this.state.rating1} name={this.state.name1} answer={this.state.answer1}
                marks={this.state.marks2} posterEmail={this.state.email1} dpLink={this.state.dpLink2}
                raterEmail={this.props.user.email} acs={this.state.userACS2}
              />
            </div>
            <br></br>
            <div hidden={!this.state.answer2 || this.state.answer2==="" || this.state.email2===this.props.user.email}>
              <UserPost rating={this.state.rating2} name={this.state.name2} answer={this.state.answer2}
                marks={this.state.marks3} posterEmail={this.state.email2} dpLink={this.state.dpLink3}
                raterEmail={this.props.user.email} acs={this.state.userACS2}
              />
            </div>
            <br></br>
            <Typography color="textSecondary" gutterBottom hidden={this.state.userAnswer==""}>
              Your Post
            </Typography>
            <br></br>
            <Card hidden={this.state.userAnswer==""}>
              <CardContent>
                <Box display="flex">
                  <Box p={1}>
                    <a href={"/profile"}>
                      <Avatar src={this.state.profilePicLink} width="60" height="60"/>
                    </a>
                  </Box>
                  <Box p={1} flexGrow={1}>
                    <Typography display="inline" color="textSecondary" gutterBottom variant="h6" >
                      <a href={"/profile"}>
                        {this.state.userName}
                      </a>
                    </Typography>
                    <Typography style={{opacity:.7}} display="inline" color="textSecondary" gutterBottom variant="h7" >
                      {"\tACS: "}{this.state.currentUserACS}
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
