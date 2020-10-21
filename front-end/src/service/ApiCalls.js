const getAuthTokenFromLS = () => { // TODO: move out
  return localStorage.getItem("Token");
};

const getAuthToken = async (username, password) => {
  // send username + pass to server
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: username,
      password,
    }),
  };

  let res = await fetch("/login", requestOptions);

  if (res.status != 200) {
    throw "err";
  } else {
    let body = await res.json();
    localStorage.setItem("Token", body.token); // TODO: make call for thisset token
    return body.token;
  }
};

const getUser = async () => {
  // send username + pass to server
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Token": getAuthTokenFromLS(),
    },
  };

  let res = await fetch("/get-user", requestOptions);

  if (res.status != 200) {
    throw "err";
  } else {
    let body = await res.json();
    return body.email;
  }
};

export { getAuthToken, getUser };
