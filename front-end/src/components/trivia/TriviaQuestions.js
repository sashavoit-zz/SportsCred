
async function addQuestion(question, option1, option2, option3, answer) {

    const response = await fetch("http://localhost:3001/addQuestion/hashasdasd", {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify({
            "question": question,
            "option1": option1,
            "option2": option2,
            "option3": option3,
            "answer": answer
        })
    });

  }

  async function addQuestionRelationship(question, user) {

    const response = await fetch("http://localhost:3001/addQuestionRelationship/hashasdasd", {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify({
            "question": question,
            "user": user
        })
    });

  }

addQuestion("Who is the only other player other than Jamal Murray to score 50 on less than 24 field goal attempts?", "Lebron James", "Michael Jordan", "Kareem Abdul Jabbar", "Bob Cousy");
addQuestion("Who are the two players to have 25 point halves in a single playoff series?","James Harden/Russel Westbrook","Michael Jordan/Kobe Bryant","Steph Curry/Lebron James","Jamal Murray/Allen Iverson");
addQuestion("Who was the NBA’s first ever unanimous mvp?","Michael Jordan","Shaquille O’Neal","LeBron James", "Steph Curry");
addQuestion("Who scored the NBA’s first ever three pointer and what year?","Gary Payton","Eric Musselman","Don Nelson","Chris Ford");
addQuestion("Who was the youngest player to score 10,000 points?","Kobe Bryant","Michael Jordan","Kevin Durant","LeBron James");
addQuestion("Who did the Los Angeles Lakers draft twice?","Kobe Bryant","Lonzo Ball","Pau Gasol","Elgin Baylor");
addQuestion("Who scored the most points in a single NBA game?","Michael Jordan","James Harden","Kobe Bryant","Wilt Chamberlain");
addQuestion("What team has the worst W-L percentage in NBA history?","New York Knicks","Cleveland Cavaliers","Phoenix Suns","Minnesota Timberwolves");
addQuestion("Who has the most Finals MVP’s?","Shaquille O’Neal","Magic Johnson","Kareem Abdul Jabbar","Michael Jordan");
addQuestion("What franchise has the most HOF’s to date?","San Antonio Spurs","Chicago Bulls","Los Angeles Lakers","Boston Celtics");
addQuestion("Who was the lowest seeded team to win an NBA championship?","Miami Heat","Portland Trailblazer","Dallas Mavericks","Houston Rockets");
addQuestion("What was the name of Toronto’s first NBA team?","Toronto Grizzlies","Toronto Knickerbokers","Toronto Raptors","Toronto Huskies");
addQuestion("Who are the only two players in NBA history to average a triple double in a single season?","Luka Doncic/James Harden","Magic Johnson/Russel Westbrook","Oscar Robertson/Lebron James","Oscar Robertson/Russell Westbrook");
addQuestion("Who holds the record for most assists in a single game?","John Stockton- 21","Magic Johnson- 22","Kevin Porter- 29","Scott Skiles- 30");
addQuestion("What team drafted Kobe Bryant?","Los Angeles Clippers","Minnesota Timberwolves","Los Angeles Lakers","Charlotte Hornets");
addQuestion("What team did Kobe Bryant score 81 points against?","Washington Wizards","Portland Trailblazers","Dallas Mavericks","Toronto Raptors");
addQuestion("Who holds the record for most steals in a playoff game?","Gary Payton","Scottie Pippen","Manu Ginobli","Allen Iverson");
addQuestion("Draymond Green was selected with the ____ pick in the NBA draft.","60th","20th","5th","35th");
addQuestion("Youngest player to ever record a triple double in NBA history?","Oscar Robertson","Luka Doncic","Lebron James","Markelle Fultz");
addQuestion("What year was the NBA created?","1961","1920","1952","1949");

addQuestionRelationship("Who is the only other player other than Jamal Murray to score 50 on less than 24 field goal attempts?", "maya");
addQuestionRelationship("Who are the two players to have 25 point halves in a single playoff series?", "maya");
addQuestionRelationship("Who was the NBA’s first ever unanimous mvp?", "maya");
addQuestionRelationship("Who scored the NBA’s first ever three pointer and what year?", "maya");
addQuestionRelationship("Who was the youngest player to score 10,000 points?", "maya");
addQuestionRelationship("Who did the Los Angeles Lakers draft twice?", "maya");
addQuestionRelationship("Who scored the most points in a single NBA game?", "maya");
addQuestionRelationship("What team has the worst W-L percentage in NBA history?", "maya");
addQuestionRelationship("Who has the most Finals MVP’s?", "maya");
addQuestionRelationship("What franchise has the most HOF’s to date?", "maya");
addQuestionRelationship("Who was the lowest seeded team to win an NBA championship?", "maya");
addQuestionRelationship("What was the name of Toronto’s first NBA team?", "maya");
addQuestionRelationship("Who are the only two players in NBA history to average a triple double in a single season?", "maya");
addQuestionRelationship("Who holds the record for most assists in a single game?", "maya");
addQuestionRelationship("What team drafted Kobe Bryant?", "maya");
addQuestionRelationship("What team did Kobe Bryant score 81 points against?", "maya");
addQuestionRelationship("Who holds the record for most steals in a playoff game?", "maya");
addQuestionRelationship("Draymond Green was selected with the ____ pick in the NBA draft.", "maya");
addQuestionRelationship("Youngest player to ever record a triple double in NBA history?", "maya");
addQuestionRelationship("What year was the NBA created?", "maya");