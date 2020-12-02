import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Tabs from "./SearchTabs";



import { makeStyles } from '@material-ui/core/styles';
import CardHeader from "@material-ui/core/CardHeader";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';


const url = "/search/";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    //backgroundColor: theme.palette.background.paper,
    backgroundColor: "#333333",
    maxWidth: "700px", left: '50%',
    position: 'relative',
    transform: 'translate(-50%, -50%)',
    marginTop: '100px',
    maxHeight: '100%',


  },
  indicator: {
    backgroundColor: 'white',
  },
  header: {
    marginBottom: '0px',
    paddingBottom: '0px',
  },
  content: {
    marginTop: '0px',
    paddingTop: '0px',
  },
}));

function SearchResults(props) {
  const classes = useStyles();
  let query = useQuery();
  let queryString = query.get("search");
  const [searchResults, setSearchResults] = useState({}); // or maybe [] / {}
  const [hasError, setErrors] = useState(false);
  const [page, setPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);

  useEffect(() => {
    // async function fetchData() {
    //   const res = await fetch("/search/users/?search="+queryString+"&params=a0BtYWlsLmNvbSYwJjEw");
    //   res
    //     .json()
    //     .then(res => setSearchResults(res))
    //     .catch(err => setErrors(err));
    // }
    // fetchData();

    // const res = fetch("/search/users/search?=k@mail.com&params=a0BtYWlsLmNvbSYwJjEw");
    // res
    //   .json()
    //   .then(res => setSearchResults(res))
    //   .catch(err => setErrors(err));
    // get search results with queryString
  }, [queryString, setSearchResults]);

  return (
    <>
      {/* <Tabs user={localStorage.getItem("User")} query={queryString}>
      </Tabs> */}
      Search results for {queryString}{JSON.stringify(searchResults)}
      <br></br>
      <br></br>

      <br></br>

     

        <Card className={classes.root} variant="outlined">
          <CardHeader className={classes.header} title="Search Results for"></CardHeader>
          <CardContent className={classes.content}>
          <Grid item xs={12}>
            <TextField disabled id="standard-disabled" value={queryString}/>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
          </Grid>
          <Grid item xs={12}>
            <Tabs user={localStorage.getItem("User")} query={queryString}>
            </Tabs>
          </Grid>
          <Grid item xs={12}>
          {JSON.stringify(searchResults)}
          </Grid>
         
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>

        {JSON.stringify(searchResults)}
    </>
  );
}

export default SearchResults;



{/* <Card className={classes.root} variant="outlined">
<CardContent>
  <Typography className={classes.title} color="textSecondary" gutterBottom>
    Word of the Day
  </Typography>
  <Typography variant="h5" component="h2">
    bbruh
  </Typography>
  <Typography className={classes.pos} color="textSecondary">
    adjective
  </Typography>
  <Typography variant="body2" component="p">
    well meaning and kindly.
    <br />
    {'"a benevolent smile"'}
  </Typography>
</CardContent>
<CardActions>
  <Button size="small">Learn More</Button>
</CardActions>
</Card> */}