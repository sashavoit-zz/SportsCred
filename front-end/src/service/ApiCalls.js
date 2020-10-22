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

const doesEmailExist = async (email) => {
  // send email to server
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
    }),
  };

  let res = await fetch("/checkEmailExists", requestOptions);

  if (res.status === 200) {
    return false;
  } else if (res.status === 406) {
    return true;
  } else {
    throw "err";
  }
};

const createUserAccount = async (firstName, lastName, phone, email, password, birthday) => {
  // send email to server
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName,
      lastName,
      phone,
      email,
      password,
      birthday,
    }),
  };

  let res = await fetch("/createUserAccount", requestOptions);

  if (res.status === 200) {
    return true;
  } else {
    throw "err";
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

  if (res.status !== 200) {
    throw "err";
  } else {
    let body = await res.json();
    return body.email;
  }
};

export { getAuthToken, getUser, doesEmailExist, createUserAccount };
