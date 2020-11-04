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
      display: "none",
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
      display: "none",
    },
    outline: "none",
  },
});

function Predictions(props) {
  const [data, setData] = useState(null);
  const classes = useStyles();

  useEffect(() => { // TODO: move async func to services
    (async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Token: localStorage.getItem("Token"),
        },
      };

      let res = await fetch("/picks/dailyPicks", requestOptions);
      
      if (res.status !== 200) {
        console.log('oops')
      } else {
        let body = await res.json();
        setData(body);
      }
    })();
  }, []);

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

export default Predictions;
