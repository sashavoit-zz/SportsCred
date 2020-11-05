
async function getQuestion(user) {

    var responseBody;

    const response = await fetch("/getQuestion/" + user +"/hashasdasd", {mode: 'cors'})
    .then(response => {
        if (response.ok) {
            response.json().then(json => {
              responseBody[0] = json["question"];
              responseBody[1] = json["option1"];
              responseBody[2] = json["option2"];
              responseBody[3] = json["option3"];
              responseBody[4] = json["answer"];
              
              return responseBody;
            })
        }
    });
}

async function removeQuestion(question, user) {

    const response = await fetch("/deleteQuestionRelationship/hashasdasd", {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify({
            "user": user,
            "question": question
        })
    });

  }