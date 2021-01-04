import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Tabs from "./SearchTabs";



import { makeStyles } from '@material-ui/core/styles';
import CardHeader from "@material-ui/core/CardHeader";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';


const url = "/search/";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#333333",
    maxWidth: "700px",
    margin: "auto",
    position: 'relative',
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
    
  }, [queryString, setSearchResults]);

  return (
    <>
      {/* <Tabs user={localStorage.getItem("User")} query={queryString}>
      </Tabs> */}
      <br></br>
      <br></br>

      <br></br>

     

        <Card className={classes.root} variant="outlined">
          <CardHeader className={classes.header} title="Search Results for"></CardHeader>
          <CardContent className={classes.content}>
            <TextField disabled id="standard-disabled" value={queryString.replaceAll("-","#")}/>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <Tabs user={localStorage.getItem("User")} query={queryString}>
            </Tabs>
         
          </CardContent>
          <CardActions>
          
          </CardActions>
        </Card>
    </>
  );
}

export default SearchResults;

