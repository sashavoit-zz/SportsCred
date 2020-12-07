
import React, { useState } from "react";
import SideBar from "../SideBar/SideBar";
import { Button, Typography, Box, makeStyles, StylesProvider, Container, Grid, Paper, TextareaAutosize, CircularProgress } from "@material-ui/core";
import { addQuestionRelationship, addQuestion, addQuestionsToUser, addQuestionsToDb } from "../../service/SignUpScript";
import Modal from 'react-modal';

const drawerWidth = 200;
const drawerHeight = 64;

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        transform             : 'translate(-50%, -50%)',
        color: 'black',
        textAlign: 'center',
        marginLeft: '100px'
    }
  };

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        position: 'absolute',
        display: 'none',
        width: '75%',
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        transform             : 'translate(-50%, -50%)',
        height: '80%'
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
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        transform             : 'translate(-50%, -50%)'
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
        fontSize: 20 + 'px',
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
        width: '80%',
        textAlign: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    lastGrid: {
        display: 'none'
    },
    startButton: {
        display: 'none',
        textAlign: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto'
    }
}));



function DualTrivia(props) {
  const classes = useStyles();
  const [progress, setProgress] = React.useState(0);
  const [totalAcs, setTotalAcs] = React.useState(0);
  const [userEmail, setUserEmail] = React.useState(localStorage.getItem("User"));
  const [opponentEmail, setOpponentEmail] = React.useState(props.opponentName);
  const [userPoints, setUserPoints] = React.useState(0);
  const [opponentPoints, setOpponentPoints] = React.useState(0);
  const [welcomeMessage, setWelcomeMessage] = React.useState("Waiting for other player...");
  const [warningMessage, setWarningMessage] = React.useState("");

  const [nextQuestionLabel, setNextQuestionLabel] = React.useState("Next question");
  const [totalPoints, setTotalPoints] = React.useState(0);
  const [OpponentTotalPoints, setOpponentTotalPoints] = React.useState(0);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [currentQuestion, setCurrentQuestion] = React.useState(1);

  var question;
  var answer;

  var answerChosen;
  var nextQuestion;

  let beginTrivia = () => {
    //document.getElementById('entry-modal').style.display = "none";
    //document.getElementById('main-modal').style.display = "block";

    //setProgress((prevProgress) => (prevProgress = 0));
    //answer = "no";
    //nextQuestion = 1;
    
    // get new question and show on site (consumer REST api)

    //addQuestionsToDb();

    sendStart();

    //document.getElementById('currentTime').innerHTML = "0";
    //document.getElementById('questionAcsLabel').innerHTML = localStorage.getItem("User") + ":";
  }

  function sendNotification() {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Token": localStorage.getItem("Token")
        },
        body: JSON.stringify({
            email: localStorage.getItem("User"),
            title: "Trivia penalty",
            content: "10 ACS points deducted for not finishing trivia game",
            type: "error"
        }),
    };

    fetch('/notifs/addNotif', requestOptions);
  }

  function updateAcs(email, offset) {
    const requestOptionsToUpdateAcs = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Token": localStorage.getItem("Token")
        },
        body: JSON.stringify({
            "email": email,
            "offset": offset
        }),
    };

    fetch('/acs/', requestOptionsToUpdateAcs);
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

  function openModal() {
    setIsOpen(true);

    if (document.getElementById('startButton') != null) {
        document.getElementById('startButton').style.display = "none";
    }
  };

  function closeModal() {
    setIsOpen(false);

    if (document.getElementById('startButton') != null) {
        document.getElementById('startButton').style.display = "block";
    }
  };

  function opponentLeft() {
    if (document.getElementById('entry-modal') != null) {
        document.getElementById('entry-modal').style.display = "block";
    }
    if (document.getElementById('main-modal') != null) {
        document.getElementById('main-modal').style.display = "none";
    }
    if (document.getElementById('startButton') != null) {
        document.getElementById('startButton').style.display = "none";
    }

    if (document.getElementById('currentQuestion') != null) {
        document.getElementById('currentQuestion').innerHTML = "10";
    }

    setWelcomeMessage("Waiting for other player...");
    setWarningMessage("");
  }

  function opponentJoined() {

    if (document.getElementById('startButton') != null) {
        document.getElementById('startButton').style.display = "block";
        console.log("entered join function");
    }

    setWelcomeMessage("Opponent is ready to play!");
    setWarningMessage("WARNING: An early exit will result in a deduction of 10 points!");
    
  }

  function opponentPressedAnswer(userAnswer, whichUser) {
      if (document.getElementById('lastGrid').innerHTML != "nothing") {
        var correct = document.getElementById('lastGrid').innerHTML;

            if (userAnswer == correct) {
                //document.getElementById('questionAcsLabel').innerHTML = localStorage.getItem("User") + ":\n" + "+1 points";
                //setTotalAcs((prevTotal) => (prevTotal = prevTotal + 1));
                if (whichUser.email == localStorage.getItem("User")) {
                    setUserPoints((prevUserPoints) => (prevUserPoints = prevUserPoints + 1));
                    setTotalPoints((prevTotalPoints) => (prevTotalPoints = prevTotalPoints + 1));
                    updateAcs(localStorage.getItem("User"), 1);
                }
                else {
                    setOpponentPoints((prevOpponentPoints) => (prevOpponentPoints = prevOpponentPoints + 1));
                    setOpponentTotalPoints((prevOpponentTotalPoints) => (prevOpponentTotalPoints = prevOpponentTotalPoints + 1));
                }
            }
            else {
                //document.getElementById('questionAcsLabel').innerHTML = localStorage.getItem("User") + ":\n" + "-1 points";
                //setTotalAcs((prevTotal) => (prevTotal = prevTotal - 1));
                if (whichUser.email == localStorage.getItem("User")) {
                    setUserPoints((prevUserPoints) => (prevUserPoints = prevUserPoints - 1));
                    setTotalPoints((prevTotalPoints) => (prevTotalPoints = prevTotalPoints - 1));
                    updateAcs(localStorage.getItem("User"), -1);
                }
                else {
                    setOpponentPoints((prevOpponentPoints) => (prevOpponentPoints = prevOpponentPoints - 1));
                    setOpponentTotalPoints((prevOpponentTotalPoints) => (prevOpponentTotalPoints = prevOpponentTotalPoints - 1));
                }
            }

            if (document.getElementById('option1Label').innerHTML == userAnswer) {
                document.getElementById('option1Label').style.backgroundColor = "#ff0000";
            }
            else if (document.getElementById('option2Label').innerHTML == userAnswer) {
                document.getElementById('option2Label').style.backgroundColor = "#ff0000";
            }
            else if (document.getElementById('option3Label').innerHTML == userAnswer) {
                document.getElementById('option3Label').style.backgroundColor = "#ff0000";
            }
            else if (document.getElementById('option4Label').innerHTML == userAnswer) {
                document.getElementById('option4Label').style.backgroundColor = "#ff0000";
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

            document.getElementById('currentTime').innerHTML = "wait";
    }
  }

  function opponentPressedStart(question, option1, option2, option3, correctAnswer) {

    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Token": localStorage.getItem("Token"), 
        },
    };
    fetch("/getUserName/"+ localStorage.getItem("User"), requestOptions)
        .then(response => response.json())
        .then((data) => {
            setUserEmail(data.firstName);
        })
        .catch(err => console.log(err))

    const requestOptions2 = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Token": localStorage.getItem("Token"), 
        },
    };
    fetch("/getUserName/"+ props.opponentName, requestOptions2)
        .then(response => response.json())
        .then((data) => {
            setOpponentEmail(data.firstName);
        })
        .catch(err => console.log(err))

    const requestOptions3 = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Token": localStorage.getItem("Token"), 
        },
    };
    fetch("/profile/"+ localStorage.getItem("User"), requestOptions3)
        .then(response => response.json())
        .then((data) => {
            setUserPoints(parseInt(data[0].acs, 10));
        })
        .catch(err => console.log(err))

    const requestOptions4 = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Token": localStorage.getItem("Token"), 
        },
    };
    fetch("/profile/"+ props.opponentName, requestOptions4)
        .then(response => response.json())
        .then((data) => {
            setOpponentPoints(parseInt(data[0].acs, 10));
        })
        .catch(err => console.log(err))

    if (document.getElementById('entry-modal') != null) {
        document.getElementById('entry-modal').style.display = "none";
    }
    if (document.getElementById('main-modal') != null) {
        document.getElementById('main-modal').style.display = "block";
    }

    setProgress((prevProgress) => (prevProgress = 0));
    answer = "no";
    nextQuestion = 1;

    var responseBody = [1,2,3,4];
    responseBody = shuffle(responseBody);

    if (document.getElementById("questionLabel") != null) {
        document.getElementById("questionLabel").innerHTML = question;
    
        document.getElementById('option' + responseBody[0].toString() + 'Label').innerHTML = option1;
        document.getElementById('option' + responseBody[1].toString() + 'Label').innerHTML = option2;
        document.getElementById('option' + responseBody[2].toString() + 'Label').innerHTML = option3;
        document.getElementById('option' + responseBody[3].toString() + 'Label').innerHTML = correctAnswer;
  
        document.getElementById('lastGrid').innerHTML = correctAnswer;
    }

    document.getElementById('currentTime').innerHTML = "0";
    document.getElementById('currentQuestion').innerHTML = "1";
    setTotalPoints(0);
    setOpponentTotalPoints(0);
    //document.getElementById('questionAcsLabel').innerHTML = localStorage.getItem("User") + ":";
  }

  function opponentPressedNext(question, option1, option2, option3, correctAnswer) {

    if (document.getElementById('currentQuestion') != null) {
        if (document.getElementById('currentQuestion').innerHTML != null) {
            var currentQuestion = parseInt(document.getElementById('currentQuestion').innerHTML);
            if (currentQuestion == 10) {
                finishGame();
            }
            else {
                currentQuestion = currentQuestion + 1;
                if (currentQuestion == 10) {
                    setNextQuestionLabel("Finish game!");
                }
                document.getElementById('currentQuestion').innerHTML = currentQuestion.toString();
                setCurrentQuestion(currentQuestion);
            }
        }
    }

    var responseBody = [1,2,3,4];
    responseBody = shuffle(responseBody);

    if (document.getElementById("questionLabel") != null) {
        document.getElementById("questionLabel").innerHTML = question;
    
        document.getElementById('option' + responseBody[0].toString() + 'Label').innerHTML = option1;
        document.getElementById('option' + responseBody[1].toString() + 'Label').innerHTML = option2;
        document.getElementById('option' + responseBody[2].toString() + 'Label').innerHTML = option3;
        document.getElementById('option' + responseBody[3].toString() + 'Label').innerHTML = correctAnswer;
  
        document.getElementById('lastGrid').innerHTML = correctAnswer;
    }


    document.getElementById("option1Label").style.backgroundColor = "#0099ff";
    document.getElementById("option2Label").style.backgroundColor = "#0099ff";
    document.getElementById("option3Label").style.backgroundColor = "#0099ff";
    document.getElementById("option4Label").style.backgroundColor = "#0099ff";

    //document.getElementById('questionAcsLabel').innerHTML = localStorage.getItem("User") + ":";

    document.getElementById('nextButton').style.display = "none";

    document.getElementById('timerLabel2').style.display = "block";

    setProgress((prevProgress) => (prevProgress = 0));

    document.getElementById('currentTime').innerHTML = "0";
  }

  function finishGame() {
    openModal();

    if (document.getElementById('currentQuestion') != null) {
      document.getElementById('currentQuestion').innerHTML = "0";
    }
    setNextQuestionLabel("Next question");
    setCurrentQuestion(1);

    if (document.getElementById('entry-modal') != null) {
      document.getElementById('entry-modal').style.display = "block";
    }

    if (document.getElementById('main-modal') != null) {
      document.getElementById('main-modal').style.display = "none";
    }
}

  async function eventListener() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Token": localStorage.getItem("Token"),
        },
    };

    let respCode = 200

    await fetch('multiplayerTrivia/listenForEvents', requestOptions)
            .then(response => {
                respCode = response.status
                return (response == null) ? null : response.json()
            })
            .then(data => {
                if (data != null && data.event != null){
                    if (data.event == "Joined") {
                        opponentJoined();
                        console.log("Joined event! : " + data.data.email);
                    }
                    else if (data.event == "Start") {
                        opponentPressedStart(data.data.Question, data.data.Option1, data.data.Option2, data.data.Option3, data.data.Answer);
                        console.log("Start event!");
                    }
                    else if (data.event == "Next") {
                        opponentPressedNext(data.data.Question, data.data.Option1, data.data.Option2, data.data.Option3, data.data.Answer);
                        console.log("Next event!");
                    }
                    else if (data.event == "Left") {
                        opponentLeft();
                        console.log("Left event!");
                    }
                    else if (data.event == "Answer") {
                        opponentPressedAnswer(data.data.answerChoice, data.data.playerAnswered);
                        console.log("Answer event!");
                    }
                }
            })
    if (respCode == 200){
        eventListener();
    }
  }

  async function sendNext() {

    const requestOptionsToSendNext = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Token": localStorage.getItem("Token")
        }
    };

    fetch('multiplayerTrivia/next', requestOptionsToSendNext);

  }

  function sendAnswer(answer) {
    const requestOptionsToSendAnswer = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Token": localStorage.getItem("Token")
        },
        body: JSON.stringify({
            answerChoice: answer
        }),
    };

    fetch('multiplayerTrivia/answer', requestOptionsToSendAnswer);
  }

  async function sendStart() {

    console.log("start button event called");

    const requestOptionsToSendStart = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Token": localStorage.getItem("Token")
        }
    };

    fetch('multiplayerTrivia/start', requestOptionsToSendStart);
  }

  function changeAnswer(pickedAnswer) {

    if (document.getElementById('lastGrid').innerHTML != "nothing") {
        var userAnswer;
        
        userAnswer = document.getElementById(pickedAnswer + "Label").innerHTML;
        sendAnswer(userAnswer);
    }
  }

  function changeAnswerWrong() {
    if (document.getElementById('lastGrid').innerHTML != "nothing") {
        var correct = document.getElementById('lastGrid').innerHTML;

        //document.getElementById('questionAcsLabel').innerHTML = localStorage.getItem("User") + ":\n" + "-1 points";
        setUserPoints((prevUserPoints) => (prevUserPoints = prevUserPoints - 1));
        setOpponentPoints((prevOpponentPoints) => (prevOpponentPoints = prevOpponentPoints - 1));
        updateAcs(localStorage.getItem("User"), -1);
        //setTotalAcs((prevTotal) => (prevTotal = prevTotal - 1));
            

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

            document.getElementById('currentTime').innerHTML = "wait";
    }
  }

 function nextQuestion() {
    sendNext();

    /*document.getElementById("option1Label").style.backgroundColor = "#0099ff";
    document.getElementById("option2Label").style.backgroundColor = "#0099ff";
    document.getElementById("option3Label").style.backgroundColor = "#0099ff";
    document.getElementById("option4Label").style.backgroundColor = "#0099ff";

    document.getElementById('questionAcsLabel').innerHTML = localStorage.getItem("User") + ":";

    document.getElementById('nextButton').style.display = "none";

    document.getElementById('timerLabel2').style.display = "block";

    setProgress((prevProgress) => (prevProgress = 0));

    document.getElementById('currentTime').innerHTML = "0";*/
  }

  React.useEffect(() => {
    
    if (props.userType == "1") {
        if (document.getElementById('startButton') != null) {
            document.getElementById('startButton').style.display = "block";
            console.log("entered join function");
        }
        setWelcomeMessage("Opponent is ready to play!");
        setWarningMessage("WARNING: An early exit will result in a deduction of 10 points!");
    }

    eventListener();
  }, [])

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
                changeAnswerWrong();
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
      if (document.getElementById('currentQuestion') != null) {
        var currentQuestion = parseInt(document.getElementById('currentQuestion').innerHTML);
        if (currentQuestion != 10) {
          updateAcs(localStorage.getItem("User"), -10);
          sendNotification();
        }
      }
    };
  }, []);

  return (
    <>
        <Container id="entry-modal" className={classes.introPage}>
            <Typography id="welcomeMessage" variant="h3" gutterBottom>
                {welcomeMessage}
            </Typography>
            <Typography id="warningMessage" variant="h5" gutterBottom>
                {warningMessage}
            </Typography>
            <Button className={classes.startButton} id="startButton" variant="contained" color="primary" onClick={beginTrivia}>
                Begin trivia!
            </Button>
        </Container>
        <Container id="main-modal" className={classes.root}>
            <Grid container spacing={5} className={classes.topHalf}>
                <Grid item xs={8} className={classes.questionBox}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} className={classes.labelBox}>
                            Question: {currentQuestion}
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
                            Players:
                            <hr></hr>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={3}>
                                <Grid item xs={6} className={classes.rightBorder}>
                                    <Typography id="questionAcsLabel" variant="h6" id="questionAcsLabel" gutterBottom>
                                        {userEmail}: <br></br> {userPoints} points
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography id="totalAcsLabel" variant="h6" id="totalAcsLabel" gutterBottom>
                                        {opponentEmail}: <br></br> {opponentPoints} points
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
                    {nextQuestionLabel}
                    </Button>
                </Grid>
            </Grid>
            <Grid id="lastGrid" container spacing={3} className={classes.lastGrid}>

            </Grid>
            <Grid id="currentTime" container spacing={3} className={classes.lastGrid}>

            </Grid>
            <Grid id="currentQuestion" container spacing={3} className={classes.lastGrid}>

            </Grid>
        </Container>
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel="Example modal" overlayClassName="Overlay">
                <Typography variant="h3" gutterBottom>
                    Game over!
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Your net point gain/loss: {totalPoints}
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Opponent net point gain/loss: {OpponentTotalPoints}
                </Typography>
                <Button variant="contained" color="primary" onClick={closeModal}>
                    Close
                </Button>
        </Modal>
    </>
    
  );
}

export default DualTrivia;