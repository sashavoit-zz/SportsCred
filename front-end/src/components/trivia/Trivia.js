
import React, { useState } from "react";
import SideBar from "../SideBar/SideBar";
import { Button, Typography, Box, makeStyles, StylesProvider, Container, Grid, Paper, TextareaAutosize, CircularProgress } from "@material-ui/core";
import { addQuestionRelationship, addQuestion, addQuestionsToUser, addQuestionsToDb } from "../../service/SignUpScript";

const drawerWidth = 200;
const drawerHeight = 64;

class AnswerObject {
    constructor () {
        this.correctResponse = "";
    }
    setCorrectReponse (newResponse) {
        this.correctResponse = newResponse;
    }
    getCorrectResponse () {
        return this.correctResponse;
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        position: 'absolute',
        marginLeft: 0,
        marginTop: drawerHeight,
        display: 'none',
        width: '75%',
        height: '100%',
    },
    introPage: {
        flexGrow: 1,
        position: 'absolute',
        textAlign: 'center',
        display: 'block',
        borderStyle: 'outset',
        paddingBottom: 5 + 'px',
        width: '40%',
        color: 'black',
        backgroundColor: 'white',
        paddingTop: '5px',
        top: '50%',
        transform: 'translateY(-50%)',
        marginLeft: '25%'
    },
    topNav: {
        border: 1 + 'px solid aqua',
        width: `calc(100% - ${drawerWidth}px)`,
        height: `calc(100% - ${drawerHeight}px)`
    },
    bottomNav: {
        border: 1 + 'px solid green'
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(2),
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: 'black'
    },
    paper2: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        backgroundColor: '#0099ff',
        color: 'white',
        fontSize: 50 + 'px',
        justifyContent: 'center',
        width: '100%'
    },
    bottomBox: {
        marginTop: 60 + 'px',
        borderStyle: 'solid',
        backgroundColor: '#808080',
        borderRadius: 5 + 'px',
        marginBottom: '30px'
    },
    answerBox: {
        color: 'black',
        borderColor: 'white',
        borderBottomColor: 'black',
        borderBottomWidth: 5 + 'px',
        fontSize: 20 + 'px'
    },
    questionBox: {
        borderColor: 'white',
        borderStyle: 'solid',
        color: 'black',
        backgroundColor: '#808080',
        borderRadius: 5 + 'px'
    },
    topHalf: {
        marginTop: '15px'
    },
    labelBox: {
        fontSize: 20 + 'px'
    },
    leftBorder: {
        borderLeft: 'thick solid black'
    },
    rightBorder: {
        borderRight: 'thin dashed black'
    },
    timerBox: {
        textAlign: 'center',
        transform: 'scale(2.5)',
        marginTop: '2%'
    },
    nextButton: {
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: "2%",
        display: "none"
    },
    optionBox: {
        width: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    lastGrid: {
        display: 'none'
    }
}));



function Trivia(props) {
  const { children: component } = props;
  const classes = useStyles();
  const [progress, setProgress] = React.useState(0);
  const [totalAcs, setTotalAcs] = React.useState(0);

  var question;
  var answer;

  var answerChosen;
  var nextQuestion;

  let pleaseWork = new AnswerObject();

  let beginTrivia = () => {
    document.getElementById('entry-modal').style.display = "none";
    document.getElementById('main-modal').style.display = "block";

    setProgress((prevProgress) => (prevProgress = 0));
    answer = "no";
    nextQuestion = 1;
    
    // get new question and show on site (consumer REST api)

    addQuestionsToDb();

    getQuestion();
    if (document.getElementById("questionLabel").innerHTML == "") {
        addQuestionsToUser(localStorage.getItem("User"));
        getQuestion();
    } 

    pleaseWork.setCorrectReponse("hello?");
    console.log(pleaseWork.getCorrectResponse());

    document.getElementById('currentTime').innerHTML = "0";
  }

  //Shuffle array algorithm from the internet: https://github.com/coolaj86/knuth-shuffle
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  async function addQuestion(question, option1, option2, option3, answer) {

    const response = await fetch("/addQuestion/hashasdasd", {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify({
            "question": question,
            "option1": option1,
            "option2": option2,
            "option3": option3,
            "answer": answer
        }),
        headers: {
            'Token': localStorage.getItem("Token") // move whole function to ApiCalls.js later
        }
    });
  }

/* async function addQuestionRelationship(question, user) {

    const response = await fetch("http://localhost:3001/addQuestionRelationship/hashasdasd", {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify({
            "question": question,
            "user": "monkeybusiness5@gmail.com"
        }),
        headers: {
            'Token': localStorage.getItem("Token") // move whole function to ApiCalls.js later
        }
    });

} */

  async function getQuestion() {

      var responseBody = [1,2,3,4];
      responseBody = shuffle(responseBody);

      var url = "/getQuestion/" + "maya" + "/hashasdasd";
      const response = await fetch(url, {
          mode: 'cors',
          headers: {
              'Token': localStorage.getItem("Token"), // move whole function to ApiCalls.js later
              'User': localStorage.getItem("User")
          }
        })
      .then(response => {
          if (response.ok) {
              response.json().then(json => {
                question = json["question"];
                document.getElementById("questionLabel").innerHTML = question;
                
                document.getElementById('option' + responseBody[0].toString() + 'Label').innerHTML = json["option1"];
                document.getElementById('option' + responseBody[1].toString() + 'Label').innerHTML = json["option2"];
                document.getElementById('option' + responseBody[2].toString() + 'Label').innerHTML = json["option3"];
                document.getElementById('option' + responseBody[3].toString() + 'Label').innerHTML = json["answer"];
                
                document.getElementById('lastGrid').innerHTML = json["answer"];
              })
          }
      });
  }

  async function removeQuestion(question) {

    const response = await fetch("/deleteQuestionRelationship/hashasdasd", {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify({
            "user": localStorage.getItem("User"),
            "question": question
        }),
        headers: {
            'Token': localStorage.getItem("Token") // move whole function to ApiCalls.js later
        }
    });

  }

  function changeAnswer(pickedAnswer) {

    if (document.getElementById('lastGrid').innerHTML != "nothing") {
        var question1 = document.getElementById("questionLabel").innerHTML;
        var correct = document.getElementById('lastGrid').innerHTML;
        var userAnswer;

        if (pickedAnswer != "wrong") {
            userAnswer = document.getElementById(pickedAnswer + "Label").innerHTML;
        }
        else{
            userAnswer = "wrong";
        }

            if (userAnswer == correct) {
                document.getElementById('questionAcsLabel').innerHTML = "Question ACS:\n" + "+6 points";
                setTotalAcs((prevTotal) => (prevTotal = prevTotal + 6));
            }
            else {
                document.getElementById('questionAcsLabel').innerHTML = "Question ACS:\n" + "-6 points";
                setTotalAcs((prevTotal) => (prevTotal = prevTotal - 6));
            }

            if (pickedAnswer != "wrong") {
                document.getElementById(pickedAnswer + "Label").style.backgroundColor = "#ff0000";
            }

             if (document.getElementById('option1Label').innerHTML == correct) {
                document.getElementById('option1Label').style.backgroundColor = "#009933";
            }
            else if (document.getElementById('option2Label').innerHTML == correct) {
                document.getElementById('option2Label').style.backgroundColor = "#009933";
            }
            else if (document.getElementById('option3Label').innerHTML == correct) {
                document.getElementById('option3Label').style.backgroundColor = "#009933";
            }
            else if (document.getElementById('option4Label').innerHTML == correct) {
                document.getElementById('option4Label').style.backgroundColor = "#009933";
            }

            document.getElementById('nextButton').style.display = "block";
            setProgress((prevProgress) => (prevProgress = 0));

            document.getElementById('timerLabel2').style.display = "none";

            document.getElementById('lastGrid').innerHTML = "nothing";

            removeQuestion(document.getElementById("questionLabel").innerHTML);

            document.getElementById('currentTime').innerHTML = "wait";
    }
  }

 function nextQuestion() {
    getQuestion();

    document.getElementById("option1Label").style.backgroundColor = "#0099ff";
    document.getElementById("option2Label").style.backgroundColor = "#0099ff";
    document.getElementById("option3Label").style.backgroundColor = "#0099ff";
    document.getElementById("option4Label").style.backgroundColor = "#0099ff";

    document.getElementById('questionAcsLabel').innerHTML = "Question ACS:";

    document.getElementById('nextButton').style.display = "none";

    document.getElementById('timerLabel2').style.display = "block";

    setProgress((prevProgress) => (prevProgress = 0));

    document.getElementById('currentTime').innerHTML = "0";
  }

  React.useEffect(() => {

    document.getElementById('option1Label').addEventListener("click", function() {changeAnswer("option1")});
    document.getElementById('option2Label').addEventListener("click", function() {changeAnswer("option2")});
    document.getElementById('option3Label').addEventListener("click", function() {changeAnswer("option3")});
    document.getElementById('option4Label').addEventListener("click", function() {changeAnswer("option4")});

    //document.getElementById('nextButton').addEventListener('click', function() {nextQuestion()});

    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 5));

        if (document.getElementById('currentTime').innerHTML != "wait") {
            var currentTime = parseInt(document.getElementById('currentTime').innerHTML);

            if (currentTime >= 100) {
                changeAnswer("wrong");
            }
            else {
                currentTime = currentTime + 5;
                document.getElementById('currentTime').innerHTML = currentTime.toString();
            }
        }
        else {
            setProgress((prevProgress) => (prevProgress = 0));
        }

    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
        <Container id="entry-modal" className={classes.introPage}>
            <Typography variant="h4" gutterBottom>
                Would you like to test your skills?
            </Typography>
            <Button variant="contained" color="primary" onClick={beginTrivia}>
                Begin trivia!
            </Button>
        </Container>
        <Container id="main-modal" className={classes.root}>
            <Grid container spacing={5} className={classes.topHalf}>
                <Grid item xs={8} className={classes.questionBox}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} className={classes.labelBox}>
                            Question:
                            <hr></hr>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography id="questionLabel" variant="h5" id="questionLabel" gutterBottom>
                                
                            </Typography>
                        </Grid>
                        <Grid item xs={4} className={classes.timerBox}>
                            <Box
                                top="0%"
                                left={1}
                                bottom="10%"
                                right={0}
                                position="absolute"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <CircularProgress id="timerLabel1" variant="static" value={progress}/>
                            </Box>
                            <Box
                                top="0%"
                                left={1}
                                bottom="8%"
                                right={0}
                                position="absolute"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Typography id="timerLabel2" variant="caption" component="div" color="textSecondary">{20- (progress/5)}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={4}>
                    <Grid container spacing={3} className={classes.questionBox}>
                        <Grid item xs={12} className={classes.labelBox}>
                            ACS:
                            <hr></hr>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={3}>
                                <Grid item xs={6} className={classes.rightBorder}>
                                    <Typography id="questionAcsLabel" variant="h6" id="questionAcsLabel" gutterBottom>
                                        Question ACS: <br></br> 
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography id="totalAcsLabel" variant="h6" id="totalAcsLabel" gutterBottom>
                                        Total ACS: <br></br> {totalAcs} points
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={3} className={classes.bottomBox}>
                <Grid item xs={12} className={classes.answerBox}>
                    Your answer:
                    <hr></hr>
                </Grid>
                <Grid item xs>
                    <Grid container spacing={3}>
                        <Grid item xs={6} className={classes.optionBox}>
                            <Button variant="contained" color="secondary" size="small" id="option1Label" className={classes.paper2}></Button>
                        </Grid>
                        <Grid item xs={6} className={classes.optionBox}>
                            <Button variant="contained" color="secondary" size="small" id="option2Label" className={classes.paper2}></Button>
                        </Grid>
                        <Grid item xs={6} className={classes.optionBox}>
                            <Button variant="contained" color="secondary" size="small" id="option3Label" className={classes.paper2}></Button>
                        </Grid>
                        <Grid item xs={6} className={classes.optionBox}>
                            <Button variant="contained" color="secondary" size="small" id="option4Label" className={classes.paper2}></Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid id="nextButton" item xs={12} className={classes.nextButton}>
                    <Button variant="contained" color="primary" size="large" onClick={nextQuestion}>
                        Next question
                    </Button>
                </Grid>
            </Grid>
            <Grid id="lastGrid" container spacing={3} className={classes.lastGrid}>

            </Grid>
            <Grid id="currentTime" container spacing={3} className={classes.lastGrid}>

            </Grid>
        </Container>
    </>
    
  );
}

export default Trivia;