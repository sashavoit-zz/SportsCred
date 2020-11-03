import React, { useState, useEffect } from "react";
import { Typography, CircularProgress, makeStyles } from "@material-ui/core";
import { ArrowLeft, ArrowRight } from "@material-ui/icons";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

import PredictionsCard from "./PredictionsCard";

const useStyles = makeStyles({
  buttonBack: {
    position: "absolute",
    top: "50%",
    left: "-20px",
    borderRadius: "100%",
    height: "40px",
    width: "40px",
    border: "none",
    padding: "1px 1px 0 0",
    transform: "translateY(-50%)",
    "&:disabled": {
        display: "none"
    },
    outline: "none",

  },
  buttonNext: {
    position: "absolute",
    top: "50%",
    right: "-20px",
    borderRadius: "100%",
    height: "40px",
    width: "40px",
    border: "none",
    padding: "1px 0 0 0",
    transform: "translateY(-50%)",
    "&:disabled": {
        display: "none"
    },
    outline: "none",
  },
});

function Predictions(props) {
  const [data, setData] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    (async () =>
      await new Promise(() =>
        setTimeout(() => setData([ ...mockApiResponse, ...mockApiResponse, ...mockApiResponse, ]), 2000)
      ))(); // hold up function for a sec before updating state
  });

  return (
    <>
      <Typography variant="h3">Picks and Predictions</Typography>
      {data ? (
        <CarouselProvider
          naturalSlideWidth={345}
          naturalSlideHeight={480}
          totalSlides={data.length}
          visibleSlides={2.9}
          style={{ position: "relative" }}
        >
          <Slider>
            {data.map((game, i) => (
              <Slide index={i}>
                <PredictionsCard data={game} />
              </Slide>
            ))}
          </Slider>
          <ButtonBack className={classes.buttonBack}>
            <ArrowLeft fontSize="large" />
          </ButtonBack>
          <ButtonNext className={classes.buttonNext}>
            <ArrowRight fontSize="large" />
          </ButtonNext>
        </CarouselProvider>
      ) : (
        <CircularProgress
          size="4rem"
          style={{ position: "fixed", top: "50%", left: "50%" }}
        />
      )}
    </>
  );
}

var mockApiResponse = [
  {
    date: "2020-11-30",
    game_id: 0,
    team1_init: "UTA",
    team1_name: "Utah Jazz",
    team2_init: "NOP",
    team2_name: "New Orleans Pelicans",
    winner: "UTA",
  },
  {
    date: "2020-11-30",
    game_id: 1,
    team1_init: "LAC",
    team1_name: "Los Angeles Clippers",
    team2_init: "LAL",
    team2_name: "Los Angeles Lakers",
    winner: "LAL",
  },
];

export default Predictions;
