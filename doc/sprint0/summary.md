**Objective**
Build a social media web-application focused on sports and sports-related discussions. The application allows users to gain community credibility of their analytical skills based on sports trivia, picks/predictions, and debate. Through the use of the app users can increase their status from being a sports newbie to an expert sports analyst, it allows them to socialize and discuss upcoming sports-related events, games, etc. 


**Key users**
1. Sports Analyst / Hardcore Sports Fans
  This group of users is the most passionate about sports. They attend games in person or watch all of them live. Most of their social media posts are about sports and their YouTube recommendations are filled with highlights, debates and analyses. They religiously keep up with all updates related to the sport. They regularly comment on online sports forums and they may even bet money on the outcome of games. They have been keeping up with sports for a long time and have a thorough knowledge of its history. They might have even been a part of competitive teams. Sports is their main passion.

1. Mediocre Sports Fan 
  This group is moderately passionate about sports. They watch some of the games and may have attended a few games in person. More likely, they just keep up with scores and watch the highlights. They might read some online articles or watch debates and analyses about sports but not as often as the previous more hardcore group of users. They may have played sports in their high school team. Sports is not their passion, it is their hobby and they spend a decent amount of time following it. 

1. Light Sports Fan
  This group is not very passionate about sports. One might ask why they would even bother to then use the SportsCred application, but they might want to interact with their friends on it or their passion for sports is just beginning. This group only watches games live when they are with their friends or if a big championship is on the line. They rarely comment or post about sports online and even more rarely watch debates and analyses. Sports are neither their passion nor their hobby.


**Key use cases**
*Register/Login/Logout
  *User can register an account with email and login
  *Users can logout
*Check users’ ACS score
  *Users can check their own ACS score in their user profile
  *Users can see the rank list of ACS scores in each tier in the Global Leaderboards page and will be directed to another user’s profile once they click on the user on the ranking list.
*Share opinions on sports in Open Court
  *Make a post to share opinions.
  *Like or dislike a post.
  *Comment under a post.
  *Reply a comment
*Pick predictions for games and awards
  *Users will be able to make predictions and once the result is finalized they will be notified if their prediction is correct or not
*Play trivia-based games
  *Play solo trivia games
  *Send a trivia request to a friend
  *Start a head to head trivia with other users
*Debate other sports fans
  *Select a debate topic and debate with other users.
  *Users can like or dislike others' analysis about the topic.


**Key Usage Scenarios**

Carlos, 32 y.o. (professional sports analyst):
1. Carlos heard about SportsCred from his colleague, he understands that he can share his thoughts and analysis on the app. He decides to register an account and have a try. Carlos’s boss wants him to write an analysis of the Raptor's last game. After finishing the analysis report, he posted a part of his report to the Open Court, the post discussed the ineffective way the Raptors played last game. Beyond expectation, he got tons of likes and some users had commented under the post.  Carlos replied to some interesting comments and started to discuss with them about the opinions in the post.
Anna, 24 y.o. (mediocre sports fan)
1. Anna logged in to SportCred and browsed debate topics as usual. The topic ‘Who is the best player on the Raptors team of all-time’ caught her attention and she strongly disagreed with other user’s opinions that Kawhi Leonard is the best. Anna is a big fan of Kyle Lowry, thus she starts a debate with other users by submitting an analysis to support why she thinks Kyle Lowry is the best. Anna got more likes than the other debater, resulting in Anna's ACS score increases.
1.Anna is in the Pro Analyst tier, she wants to check who has the highest ACS score in the same tier. She navigates to the Global Leaderboards page and filters the user by Pro Analyst, she clicks on the user named Carla who is on the top of the list and she is taken to that user’s profile. 
Brijesh, 27 y.o. (light sports fan)
1.Brijesh visited his father yesterday and they talked a lot about recent basketball matches. They have very different predictions about the next few matches. Brijesh put his prediction on SportCred. He bet the Raptors would win the series against the Celtics. After some time, Brijesh is notified that his prediction about the Raptors was incorrect resulting in a decrease in his ACS score.
1.Brijesh’s ACS is under 100 since he seldom opens this app. Now he wants to increase his score and Trivia in the best way. He selects the Daily Solo Trivia option since he always loses in head to head trivia. Brijesh answers all the questions correctly within the time limit which results in an increase in his ACS.

**Key principles**
*User experience is the highest priority
  *Develop a user-friendly and intuitive UI
  *Eliminate any possible bugs for the end-users
*Keep implementation simple
  *Avoid complicated solutions, keep implementation simple so that code can be easily refactored  
*Readability over optimization
  *Code that is readable but expensive (in terms of memory or run-time) should be preferred over code that is not readable but optimized.
  *This will allow faster development, as code can be easily understood and expanded upon by everyone.
*Modular development and separation of concerns
  *Follow microservices architecture paradigm 
  *Avoid tightly coupled code and large functions
*Address issues as soon as they arise
  *Communicate issues effectively during daily stand-ups
