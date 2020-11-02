import React from "react";
import { Card, Grid, makeStyles, Typography } from "@material-ui/core";

import PredictionsCard from './PredictionsCard' 

function Predictions(props) {
  return (
    <Grid container>
      <Grid item xs={12} sm={6}>
        <PredictionsCard />
      </Grid>
      <Grid item xs={12} sm={6}>
      <PredictionsCard />
      </Grid>
    </Grid>
  );
}

export default Predictions;
