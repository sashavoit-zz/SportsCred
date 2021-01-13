import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  makeStyles,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid
} from "@material-ui/core";
import { ArrowLeft, ArrowRight } from "@material-ui/icons";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import "./Carousel.css";

import PredictionsCard from "./PredictionsCard";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    "& label.Mui-focused": {
      color: "#c2adba",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#c2adba",
      },
    },
    "& .MuiOutlinedInput-input": {
      padding: "14.5px 13px",
    }
  },
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
  }
}));

function Predictions(props) {
  const [data, setData] = useState(null);
  const [conference, setConference] = useState("both")
  const classes = useStyles();

  useEffect(() => {
    (async () => {
      setData(null)
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Token: localStorage.getItem("Token"),
        },
      };

      let res = await fetch(`/picks/dailyPicks?conference=${conference}`, requestOptions);

      if (res.status !== 200) {
        console.log("oops");
      } else {
        let body = await res.json();
        setData(body);
      }
    })();
  }, [conference]);

  return (
    <>
      <Grid container justify="flex-end">
        <Grid item>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="conference-picker">Conferences</InputLabel>
              <Select
                  label="Conferences"
                  labelid="conference-picker"
                  id="conference-picker"
                  value={conference}
                  onChange={(event) => setConference(event.target.value)}
              >
                <MenuItem value={"both"}>Both</MenuItem>
                <MenuItem value={"eastern"}>Eastern</MenuItem>
                <MenuItem value={"western"}>Western</MenuItem>
              </Select>
          </FormControl>
        </Grid>
      </Grid>

      {data ? (
          <CarouselProvider
            naturalSlideWidth={345}
            naturalSlideHeight={400}
            totalSlides={data.length}
            visibleSlides={2.8}
            style={{ position: "relative" }}
          >
            <Slider>
              {data.map((game, i) => (
                <Slide index={i} key={i}>
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
