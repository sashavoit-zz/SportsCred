
import React from "react";
import SideBar from "../SideBar/SideBar";
import { Button, Typography, Box, makeStyles, StylesProvider, Container, Grid, Paper, TextareaAutosize } from "@material-ui/core";

const drawerWidth = 200;
const drawerHeight = 64;

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        position: 'absolute',
        marginLeft: drawerWidth
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
    }
}));

function Trivia(props) {
  const { children: component } = props;
  const classes = useStyles();

  return (
    <Container className={classes.root}>
        <Grid container spacing={5}>
            <Grid item xs={8} className={classes.questionBox}>
                <Grid container spacing={3}>
                    <Grid item xs={12} className={classes.labelBox}>
                        Question: 3/10
                        <hr></hr>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h4" gutterBottom>
                            What team did Kobe Bryant score 81 points against?
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>

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
                            <Grid item xs={6}>
                                <Typography variant="h6" gutterBottom>
                                    Question ACS: <br></br> 6 points
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" gutterBottom>
                                    Total trivia ACS: <br></br>+ 15 points
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
                        <Paper className={classes.paper2}>Knicks</Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={classes.paper2}>Mavericks</Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={classes.paper2}>Suns</Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={classes.paper2}>Raptors</Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Container>
  );
}

export default Trivia;