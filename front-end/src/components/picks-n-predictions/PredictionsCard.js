import React, { useState, useEffect, useRef } from "react";
import {Grid, makeStyles, Typography, Chip, Fade} from "@material-ui/core";
import LazyLoad from "react-lazyload";

const useStyles = makeStyles({
  root: {
    marginTop: 30,
    marginRight: 30,
    maxWidth: 345,
  },
  teamRight: {
    background: "linear-gradient(to left, rgba(255,255,255,0) 0%,#000000 101%)",
    minHeight: "inherit",
    cursor: "pointer",
    "&:hover": {
      "& $teamImageRight": {
        transform: "scale(1.1, 1.1)",
        filter: "opacity(1)",
      },
    },
  },
  teamLeft: {
    background:
      "linear-gradient(to right, rgba(255,255,255,0) 0%,#000000 101%)",
    minHeight: "inherit",
    opacity: "1",
    cursor: "pointer",
    "&:hover": {
      "& $teamImageLeft": {
        transform: "scale(1.1, 1.1)",
        filter: "opacity(1)",
      },
    },
  },
  cardTitle: {
    minWidth: "13rem",
    minHeight: "1rem",
    maxHeight: "1rem",
    position: "relative",
    left: "40%",
    paddingTop: "2vh",
    paddingBottom: "2vh",
  },
  teamImageLeft: {
    borderRadius: "50%",
    position: "relative",
    top: "19.5rem",
    left: "1rem",
    filter: "opacity(0.8)",
    transition: "all 0.75s",
  },
  teamImageRight: {
    borderRadius: "50%",
    position: "relative",
    top: "19.5rem",
    left: "4rem",
    opacity: 0.8,
    transition: "all 0.75s",
  },
  backgroundLeft: {
    width: "100%",
    minHeight: "30rem",
    maxHeight: "30rem",
    backgroundImage: (props) => `url(${props.imageUrl1})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "50% 0",
  },
  backgroundRight: {
    width: "100%",
    minHeight: "30rem",
    maxHeight: "30rem",
    backgroundImage: (props) => `url(${props.imageUrl2})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "50% 0",
  },
});

function PredictionsCard(props) {
  const { data } = props;

  const classes = useStyles({ imageUrl1: data.team1_city, imageUrl2: data.team2_city });

  const [pick, setPick] = useState(null);
  const pickVal = useRef({ gameId: data.game_id, pick: null }); // need b/c we want useEffect to work w []

  const addNewPredictions = async (gameId, prediction) => {
    if (!prediction) {
      // picks not been made
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: localStorage.getItem("Token"),
      },
      body: JSON.stringify({
        game_id: gameId,
        winner: prediction,
      }),
    };

    await fetch("/picks/newPrediction", requestOptions);
  };

  useEffect(() => {
    pickVal.current = { ...pickVal.current, pick: pick };
  }, [pick]);

  useEffect(() => {
    return () =>
        addNewPredictions(pickVal.current.gameId, pickVal.current.pick);
  }, []);

  const handleClick = (side) => {
    setPick(side);
  };

  return (
    <Grid container spacing={0} className={classes.root}>
      <Grid item xs={12} sm={6}>
        <LazyLoad height="30rem">
          <section
            className={classes.backgroundLeft}
            onClick={() => handleClick(data.team1_init)}
          >
            <section className={classes.teamLeft}>
              <div className={classes.cardTitle}>
                <Typography
                  variant="h4"
                  style={{
                    fontFamily: "emoji",
                    textAlign: "center",
                    opacity: 0.8,
                  }}
                >
                  {data.team1_init} vs {data.team2_init}
                </Typography>
                <Typography
                  variant="h6"
                  style={{ textAlign: "center", opacity: 0.8 }}
                >
                  {data.date}
                  <Fade in={Boolean(pick)} timeout={550}>
                    <Chip
                      variant="outlined"
                      onDelete={() => setPick(null)}
                      label={`${pick} predicted`}
                    />
                  </Fade>
                </Typography>
              </div>
              <img src={data.team1_logo} className={classes.teamImageLeft}></img>
            </section>
          </section>
        </LazyLoad>
      </Grid>
      <Grid item xs={12} sm={6}>
        <LazyLoad height="30rem">
          <section
            className={classes.backgroundRight}
            onClick={() => handleClick(data.team2_init)}
          >
            <section className={classes.teamRight}>
              <div className={classes.cardTitle}></div>
              <img src={data.team2_logo} className={classes.teamImageRight}></img>
            </section>
          </section>
        </LazyLoad>
      </Grid>
    </Grid>
  );
}

export default PredictionsCard;
