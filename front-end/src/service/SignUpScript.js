async function addQuestionRelationship(question, user) {

    await fetch("/addQuestionRelationship/hashasdasd", {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify({
            "question": question,
            "user": user
        }),
        headers: {
            'Token': localStorage.getItem("Token") // move whole function to ApiCalls.js later
        }
    });

}

async function addQuestion(question, option1, option2, option3, answer) {

    await fetch("/addQuestion/hashasdasd", {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify({
            "question": question,
            "option1": option1,
            "option2": option2,
            "option3": option3,
            "answer": answer
        }),
        headers: {
            'Token': localStorage.getItem("Token") // move whole function to ApiCalls.js later
        }
    });
}

async function addQuestionsToUser(user) {
    addQuestionRelationship("Who is the only other player other than Jamal Murray to score 50 on less than 24 field goal attempts?", user);
    addQuestionRelationship("Who are the two players to have 25 point halves in a single playoff series?", user);
    addQuestionRelationship("Who was the NBA’s first ever unanimous mvp?", user);
    addQuestionRelationship("Who scored the NBA’s first ever three pointer and what year?", user);
    addQuestionRelationship("Who was the youngest player to score 10,000 points?", user);
    addQuestionRelationship("Who did the Los Angeles Lakers draft twice?", user);
    addQuestionRelationship("Who scored the most points in a single NBA game?", user);
    addQuestionRelationship("What team has the worst W-L percentage in NBA history?", user);
    addQuestionRelationship("Who has the most Finals MVP’s?", user);
    addQuestionRelationship("What franchise has the most HOF’s to date?", user);
    addQuestionRelationship("Who was the lowest seeded team to win an NBA championship?", user);
    addQuestionRelationship("What was the name of Toronto’s first NBA team?", user);
    addQuestionRelationship("Who are the only two players in NBA history to average a triple double in a single season?", user);
    addQuestionRelationship("Who holds the record for most assists in a single game?", user);
    addQuestionRelationship("What team drafted Kobe Bryant?", user);
    addQuestionRelationship("What team did Kobe Bryant score 81 points against?", user);
    addQuestionRelationship("Who holds the record for most steals in a playoff game?", user);
    addQuestionRelationship("Draymond Green was selected with the ____ pick in the NBA draft.", user);
    addQuestionRelationship("Youngest player to ever record a triple double in NBA history?", user);
    addQuestionRelationship("What year was the NBA created?", user);

    addQuestionRelationship("What university did Dwayne Wade attend?", user);
    addQuestionRelationship("How many players to this date have made the jump from high school to the NBA?", user);
    addQuestionRelationship("How many championship rings does the Laker franchise have?", user);
    addQuestionRelationship("What is Shaquille O’neal’s career PPG average?", user);
    addQuestionRelationship("Who scored the Toronto Raptors first ever franchise basket?", user);
    addQuestionRelationship("Who is the only player to average a triple double in the NBA finals?", user);
    addQuestionRelationship("Who was the only team to beat Michael Jordan in a series between 1991 and 1998?", user);
    addQuestionRelationship("How many points did Reggie Miller score in the final 18.7 seconds of Game 1 against the New York Knicks in 1995?", user);
    addQuestionRelationship("Which coach did Latrell Spreewell choke in practice?", user);
    addQuestionRelationship("Who did the Toronto Raptors trade in exchange to the rights for Vince Carter in 1998?", user);
    addQuestionRelationship("Who won the 1997 rookie of the year?", user);
    addQuestionRelationship("Who were the first team to be a #1 seed and lose to a #8 seed in the NBA playoffs?", user);
    addQuestionRelationship("When was the last time Kobe Byrant made all NBA first team?", user);
    addQuestionRelationship("What two teams did Kareem Abdul-Jabbar play for?", user);
    addQuestionRelationship("What team originally drafted Brandon Roy in 2006?", user);
    addQuestionRelationship("1989 NBA Playoffs - Game 5 between the Chicago Bulls and Cleveland Cavaliers - Michael Jordan made what came to be known today as 'the Shot'. The Bulls were trailing by one point and had the ball with 3 seconds to go. Who did Jordan shoot over?", user);
    addQuestionRelationship("What shoes was Jordan wearing when he  made his first well known 'game winner'?", user);
    addQuestionRelationship("Which of the following was a NBA scoring champ one year after being named Rookie of the Year?", user);
    addQuestionRelationship("What number did Scottie Pippen wear?", user);
    addQuestionRelationship("Who won the 2005 NBA MVP?", user);
    addQuestionRelationship("What player led the NBA in points per game during the 03-04 season?", user);
    addQuestionRelationship("What year did LeBron James win his first MVP?", user);
    addQuestionRelationship("Who was the NBA’s first ever MVP in 1956?", user);
    addQuestionRelationship("What was LeBron James rookie stat line?", user);
    addQuestionRelationship("Who won MVP in 2008?", user);
    addQuestionRelationship("What team did Damian Lillard eliminate with an iconic game winner over Paul George?", user);
    addQuestionRelationship("How many sixth man of the year awards has Jamal Crawford won?", user);
    addQuestionRelationship("Which player is the all time leader in points scored for the Memphis Grizzlies?", user);
    addQuestionRelationship("Which player was traded from the Toronto Raptors for Kawhi Leonard?", user);
    addQuestionRelationship("Which player scored 37 points in a single quarter?", user);
    addQuestionRelationship("Who is the all time leader in points scored for the Toronto Raptors?", user);
    addQuestionRelationship("What is Dwayne Wade’s nickname?", user);
}

async function addQuestionsToDb() {
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

    addQuestion("What university did Dwayne Wade attend?", "Georgia Tech", "Boston College", "Duke", "Marquette");
    addQuestion("How many players to this date have made the jump from high school to the NBA?", "75", "10", "22", "44");
    addQuestion("How many championship rings does the Laker franchise have?", "11", "15", "18", "16");
    addQuestion("What is Shaquille O’neal’s career PPG average?", "30.1", "27.3", "19.5", "23.7");
    addQuestion("Who scored the Toronto Raptors first ever franchise basket?", "Doug Christie", "Vince Carter", "Damon Stoudamire", "Alvin Robertson");
    addQuestion("Who is the only player to average a triple double in the NBA finals?", "Oscar Robertson", "Larry Bird", "Magic Johnson", "LeBron James");
    addQuestion("Who was the only team to beat Michael Jordan in a series between 1991 and 1998?", "Boston Celtics", "Detroit Pistons", "Houston Rockets", "Orlando Magic");
    addQuestion("How many points did Reggie Miller score in the final 18.7 seconds of Game 1 against the New York Knicks in 1995?", "12", "6", "10", "8");
    addQuestion("Which coach did Latrell Spreewell choke in practice?", "Don Nelson", "Jeff Van Gundy", "Flip Saunders", "PJ Carlesimo");
    addQuestion("Who did the Toronto Raptors trade in exchange to the rights for Vince Carter in 1998?", "Mike Bibby", "Keon Clark", "Bonzi Wells", "Antawn Jamison");
    addQuestion("Who won the 1997 rookie of the year?", "Steve nash", "Stephon Marbury", "Marcus Camby", "Allen Iverson");
    addQuestion("Who were the first team to be a #1 seed and lose to a #8 seed in the NBA playoffs?", "Portland Trailblazers", "Dallas mavericks", "LA Lakers", "Seattle SuperSonics");
    addQuestion("When was the last time Kobe Byrant made all NBA first team?", "2010-11", "2011-12", "2013-14", "2012-13");
    addQuestion("What two teams did Kareem Abdul-Jabbar play for?", "Baltimore Bullets, Seattle Supersonics", "LA Lakers, New York Knicks", "Milwauke Bucks, Houston Rockets", "LA Lakers, Milwaukee Bucks");
    addQuestion("What team originally drafted Brandon Roy in 2006?", "Washington Wizards", "Indian Pacers", "Portland Trailblazers", "Minnesota Timberwolves");
    addQuestion("1989 NBA Playoffs - Game 5 between the Chicago Bulls and Cleveland Cavaliers - Michael Jordan made what came to be known today as 'the Shot'. The Bulls were trailing by one point and had the ball with 3 seconds to go. Who did Jordan shoot over?", "Larry Nance", "Steve Kerr", "Ron Harper", "Craig Ehlo");
    addQuestion("What shoes was Jordan wearing when he  made his first well known 'game winner'?", "Jordan 13", "Jordan 3", "Jordan 1", "Jordan 4");
    addQuestion("Which of the following was a NBA scoring champ one year after being named Rookie of the Year?", "Kobe Bryant", "Lebron james", "Michael Jordan", "Dave Bing");
    addQuestion("What number did Scottie Pippen wear?", "32", "34", "23", "33");
    addQuestion("Who won the 2005 NBA MVP?", "Dirk Nowitzki", "Kobe Bryant", "Lebron James", "Steve Nash");
    addQuestion("What player led the NBA in points per game during the 03-04 season?", "Kobe Bryant", "Kevin Garnett", "Peja Stojakovic", "Tracy McGrady");
    addQuestion("What year did LeBron James win his first MVP?", "2010-2011", "2006-2007", "2007-2008", "2008-2009");
    addQuestion("Who was the NBA’s first ever MVP in 1956?", "Larry Foust", "Bill Sharman", "George Mikan", "Bob Pettit");
    addQuestion("What was LeBron James rookie stat line?", "22PPG-8APG-5RPG", "25PPG-5APG-6RPG", "18PPG-6APG-6RSP", "20PPG-5APG-5RPG");
    addQuestion("Who won MVP in 2008?", "Dirk Nowitzki", "Chris Paul", "Steve Nash", "Kobe Bryant");
    addQuestion("What team did Damian Lillard eliminate with an iconic game winner over Paul George?", "Atlanta hawks", "LA Clippers", "Indiana Pacers", "OKC thunder");
    addQuestion("How many sixth man of the year awards has Jamal Crawford won?", "5", "2", "4", "3");
    addQuestion("Which player is the all time leader in points scored for the Memphis Grizzlies?", "Pau Gasol", "Zach Randolph", "Marc Gasol", "Mike Conley");
    addQuestion("Which player was traded from the Toronto Raptors for Kawhi Leonard?", "CJ Miles", "Delon Wright", "Malachi Richardson", "DeMar DeRozen");
    addQuestion("Which player scored 37 points in a single quarter?", "James Harden", " Steph Curry", "James Johnson", "Klay Thompson");
    addQuestion("Who is the all time leader in points scored for the Toronto Raptors?", "Kawhi Leonard", "Chris Bosh", "Vince Carter", "DeMar DeRozan");
    addQuestion("What is Dwayne Wade’s nickname?", "Invisible Man", "Speedy", "Lightning", "Flash");
}

export { addQuestionRelationship, addQuestion, addQuestionsToUser, addQuestionsToDb };