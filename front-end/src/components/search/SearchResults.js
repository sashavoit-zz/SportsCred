import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults(props) {
  let query = useQuery();
  let queryString = query.get("search");
  const [searchResults, setSearchResults] = useState(""); // or maybe [] / {}

  useEffect(() => {
    // get search results with queryString
    setSearchResults("again " + queryString);
  }, [queryString, setSearchResults]);

  return (
    <>
      {queryString} <br /> {searchResults}
    </>
  );
}

export default SearchResults;
