import React from "react";

function Account(props) {
  return (
    <h1 style={{ margin: '20px' }}>{props.user.email}</h1>
  );
}

export default Account;