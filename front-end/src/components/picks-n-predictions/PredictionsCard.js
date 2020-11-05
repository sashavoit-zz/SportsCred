import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Grid,
  makeStyles,
  Typography,
  Chip,
  Fade,
} from "@material-ui/core";

// TODO: clean up css - have another json and then spread the contents here, just update nessecary bits
const useStyles = makeStyles({
  root: {
    marginTop: 30,
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
    top: "21rem",
    left: "1rem",
    filter: "opacity(0.8)",
    transition: "all 0.75s",
  },
  teamImageRight: {
    borderRadius: "50%",
    position: "relative",
    top: "21rem",
    left: "4rem",
    opacity: 0.8,
    transition: "all 0.75s",
  },
  backgroundLeft: {
    width: "100%",
    minHeight: "30rem",
    maxHeight: "30rem",
    backgroundImage: (props) => `url(${props.mockImageUrl1})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "50% 0",
  },
  backgroundRight: {
    width: "100%",
    minHeight: "30rem",
    maxHeight: "30rem",
    backgroundImage: (props) => `url(${props.mockImageUrl2})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "50% 0",
  },
});

function PredictionsCard(props) {
  const { data } = props;
  // TODO: urls can be either sent from props or api call can be made here
  const mockImageUrl1 =
    "https://img.theculturetrip.com/wp-content/uploads/2017/03/toronto-skyline.jpg";
  const mockImageUrl2 = "https://i.redd.it/wudu7o2o0xrz.jpg";
  const teamLogo1 =
    "https://ssl.gstatic.com/onebox/media/sports/logos/745IgW4NSvnRxg-W9oczmQ_96x96.png";
  const teamLogo2 =
    "https://ssl.gstatic.com/onebox/media/sports/logos/XD2v321N_-vk7paF53TkAg_96x96.png";

  const classes = useStyles({ mockImageUrl1, mockImageUrl2 });

  const [pick, setPick] = useState(null);
  const pickVal = React.useRef({ gameId: data.game_id, pick: null }); // need b/c we want useEffect to work w []

  const addNewPerdictions = async (gameId, prediction) => {
    if (!prediction) { // picks not been made
      return;
    }

    // TODO: move to services
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

    let res = await fetch("/picks/newPrediction", requestOptions);

    if (res.status !== 200) {
      // nothing for now
    } else {
      console.log("oops");
    }
  };

  useEffect(() => {
    pickVal.current = { ...pickVal.current, pick: pick };
  }, [pick]);

  useEffect(() => {
    return () => addNewPerdictions(pickVal.current.gameId, pickVal.current.pick)
  }, []);
  
  const handleClick = (side) => {
    setPick(side);
  };

  return (
    <Grid container spacing={0} className={classes.root}>
      <Grid item xs={12} sm={6}>
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
                {/* TODO: Update Label here + conditional rendering for only when side is defined */}
              </Typography>
            </div>
            <img src={teamLogo1} className={classes.teamImageLeft}></img>
          </section>
        </section>
      </Grid>
      <Grid item xs={12} sm={6}>
        <section
          className={classes.backgroundRight}
          onClick={() => handleClick(data.team2_init)}
        >
          <section className={classes.teamRight}>
            <div className={classes.cardTitle}></div>
            <img src={teamLogo2} className={classes.teamImageRight}></img>
          </section>
        </section>
      </Grid>
    </Grid>
  );
}

export default PredictionsCard;
