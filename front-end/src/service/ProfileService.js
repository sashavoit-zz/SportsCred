const fetchUserProfilePic = async (email) =>{
    const requestOptions = {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Token": localStorage.getItem("Token"),
      },
    };
    let result = await fetch("/getUserProfilePic/"+email, requestOptions)
        .then(response => response.json())
        .then(
          (result) => {
            return result.link
        },
        (error) => {
        }
      )
      return result
  }
  export {fetchUserProfilePic}