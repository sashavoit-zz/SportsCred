import React, { useState, useEffect } from "react";
import { Typography, CircularProgress } from "@material-ui/core";

import PredictionsCard from "./PredictionsCard";

function Predictions(props) {
  const [data, setData] = useState(null);

    useEffect(() => {
      (async () => await new Promise(() => setTimeout(() => setData(mockApiResponse), 2000)))() // hold up function for a sec before updating state
    });

  return (
    <>
      <Typography variant="h3">Picks and Predictions</Typography>
      {data ? (
        <PredictionsCard predictions={data} />
      ) : (
        <CircularProgress
          size="4rem"
          color="default"
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
