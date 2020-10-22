import React from "react";

// TODO: make better
function Account(props) {
  console.log(props)
  return (
    <h1 style={{ margin: '20px' }}>{props.user}</h1>
  );
}

export default Account;