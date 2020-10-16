
import React from "react";
import SideBar from "../SideBar/SideBar";
import { Button, Typography, Box, makeStyles, StylesProvider, Container, Grid, Paper, TextareaAutosize, CircularProgress } from "@material-ui/core";

const drawerWidth = 200;
const drawerHeight = 64;

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        position: 'absolute',
        marginLeft: drawerWidth,
        display: 'none'
    },
    introPage: {
        flexGrow: 1,
        position: 'absolute',
        marginLeft: drawerWidth,
        textAlign: 'center',
        display: 'block',
        borderStyle: 'outset',
        paddingBottom: 5 + 'px',
        width: '40%',
        color: 'black',
        backgroundColor: 'white',
        paddingTop: '5px'
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
        fontSize: 50 + 'px'
    },
    bottomBox: {
        marginTop: 60 + 'px',
        borderStyle: 'solid',
        backgroundColor: 'white',
        borderRadius: 5 + 'px'
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
        backgroundColor: 'white',
        borderRadius: 5 + 'px'
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
    buttonStyle: {

    }
}));

function Trivia(props) {
  const { children: component } = props;
  const classes = useStyles();
  const [progress, setProgress] = React.useState(0);

  const [question, setQuestion] = React.useState(1);
  const [option1, setOption1] = React.useState(2);
  const [option2, setOption2] = React.useState(3);
  const [option3, setOption3] = React.useState(4);
  const [option4, setOption4] = React.useState(5);

  const [totalAcs, setTotalAcs] = React.useState(6);
  const [questionAcs, setQuestionAcs] = React.useState(7);

  let beginTrivia = () => {
    document.getElementById('entry-modal').style.display = "none";
    document.getElementById('main-modal').style.display = "block";
    setProgress((prevProgress) => (prevProgress = 0));
  }

  let getQuestion = () => {

  }

  let deleteQuestion = () => {

  }

  let verifyAnswer = (optionNum) => {
      
  }

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 5));
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
        <Container id="entry-modal" className={classes.introPage}>
            <Typography variant="h3" gutterBottom>
                Would you like to test your skills?
            </Typography>
            <Button variant="contained" color="primary" onClick={beginTrivia}>
                Begin trivia!
            </Button>
        </Container>
        <Container id="main-modal" className={classes.root}>
            <Grid container spacing={5}>
                <Grid item xs={8} className={classes.questionBox}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} className={classes.labelBox}>
                            Question:
                            <hr></hr>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="h4" gutterBottom>
                                {question}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} className={classes.timerBox}>
                            <CircularProgress variant="static" value={progress} />
                            <Box
                                top={0}
                                left={1}
                                bottom={5}
                                right={0}
                                position="absolute"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Typography variant="caption" component="div" color="textSecondary">{20- (progress/5)}</Typography>
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
                                    <Typography variant="h6" gutterBottom>
                                        Question ACS: <br></br> {questionAcs} points
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Total trivia ACS: <br></br> {totalAcs} points
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
                        <Grid item xs={6}>
                            <Paper className={classes.paper2}>{option1}</Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper className={classes.paper2}>{option2}</Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper className={classes.paper2}>{option3}</Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper className={classes.paper2}>{option4}</Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    </>
    
  );
}

export default Trivia;