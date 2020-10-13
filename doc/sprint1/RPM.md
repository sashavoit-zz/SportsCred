## Meeting summary

We had two release planning meetings. 
In the first meeting, we lightly discussed which features should be tackled on each of the four sprints. We sorted the features based on priority, workload and dependency on other features.

Initially, we had set our release goal for the first sprint to be relatively less ambitious than the sprints, as some members were not completely familiar with React (our front-end framework) and no one in our team had any experience with Chi (our back-end framework). However, we realized half of sprint 1 would fall on reading week, so we had a second meeting, where we increased the number of features we planned to release in the first sprint. We all agreed that we could spend more time on the project during reading week. We decided on adding more foundational features related to the user's profile and trivia to sprint one while shifting subsequent features up one sprint to evenly divide the workload.

## Release goals
Major release goals
- Account creation/access
- Create and interact with posts on OpenCourt
- Create and interact with posts on Debates
- Play trivia
- Have picks and predictions
- View/Interact with other user's accounts

Since we release a new version of our product at the end of every sprint, our release plan will be dictated by our plan for the coming sprints.
  
### Sprint 1 (Oct 6 - Oct 20)
- Sign up/log in/log out
  This is a required functionality, users must be able to create accounts, log in and log out. Every other functionality, such as being able to post comments, play trivia or start debates, requires that the user first have an account. So we've decided to complete that feature in our current sprint. 
  <br/>
  > Related Stories
  > - As a regular user, I want to create an account with an email to use the app 
  > - As a regular user, I want to login with email and password, so that I can use the app. 
  > - As a regular user, I want to logout of the app, so that I can prevent other computer users from having access to my account.
- Post/browse on OpenCourt
  We decided to put OpenCourt in our first sprint because it isn't dependent on any other feature except the sign up/log in. It's also relatively simple to implement.
  <br/>
  > Related Stories
  > - As a regular user, I want to post on the open court to express my opinion on a sports event.
  > - As a regular user, I want to view and scroll past posts to gain perspective on other people’s opinions.
- View profile
  - SportsCred has a key social media aspect, that allows its users to connect. So at the very least, users should be able to their profile and the profiles of others, to see each other's activity history and ACS score. This is another foundational feature, which is why we've put it in the first sprint.
  - As a regular user, I want to be able to update my profile so other users can know more about me. 
  - As a regular user, I want to view my ACS score history to track and evaluate my performance. 
  - As a regular user, I want to search for other users by name to find. 
- Play solo trivia
  - Trivia is another major aspect of SportsCred. We've put this in the first sprint because playing solo trivia games is a high priority requirement and relatively simple to implement.
  - As a regular user, I want to play solo trivia games to check my knowledge of sports history. 

### Sprint 2 (Oct 20 - Nov 3)
- Interact with posts on OpenCourt
  - By interacting with posts we mean like/dislike/comment/reply, we've put this in the second sprint because the user first needs to be able to create and view posts before interacting with them.
  - As a regular user, I want to like or dislike and comment on others' posts on the open court to express my agreement or disagreement with their point of view.
  - As a regular user, I want to be able to repost from other social media platforms to show my agreement with the author of the original post. 
  - As a regular user, I want to be able to repost my posts from SPORSCRED to other social media platforms to share my sporting opinions with my friends.
- Picks n predictions
  - This is another key feature of SportsCred. We've left this to the second sprint because it is complicated to implement, we have to store user's predictions and after the necessary amount of time has passed, we have to provide them with an update on the correctness of their choice.
  - As a regular user, I want to be able to make preseason predictions on the upcoming NBA season to test my knowledge and analytical skills. 
  - As a regular user, I want to be able to make daily picks on the outcome of the game to test my knowledge and analytical skills.
- Create debates
  - SportsCred has a key debate feature, that allows its users to discuss with each other their opinion. Debates borrow heavily from OpenCourt posts, which is why we've deicded to implement OpenCourt in our first sprint and Debates in our second.
  - As a regular user, I want to debate with other users who have similar ACS with me to check who’s opinion is right and change their ACS score accordingly.

### sprint 3
- Friends
  - This isn't a required story, however, we think it's necessary to maintain some sort of friends list for every user so that they can easily and regularly interact with specific users. We've put in the 3rd sprint because it isn't required and it depends on the user being able to view other accounts first.
  - As a regular user, I want to send a friend request to other users to keep in touch and keep track of their ACS performance. 
  - As a regular user, I want to access my friends' list within my profile section to track their ACS score.
- Interact with debates
  - In sprint 2, we will implement the feature that lets users create debates. And in the 3rd sprint, we will implement features that let other users interact with debates.
  - As a regular user, I want to be able to like/dislike debate threads to show support/opposition for debate topics or indicate a poorly chosen topic.
  - As a regular user, I want to be able to like/dislike comments in debate threads to show support/opposition for a particular argument.
  - As a regular user, I want to be able to search for debates to quickly find the topics I’m interested in.

### sprint 4
- Account recovery
  - This is a nice to have feature, it might also be difficult to implement because we have to set up an email service and a verification service. So for those two reasons we have left it to the last sprint.
  - As a regular user, I want to be able to recover my password via email to not lose my account in case I forget the password. 
- Play trivia with other players
  - This is a complicated feature as we have to set up live interaction between users and create a system for trading ACS points. Because of its complexity, we left it to the last sprint.
  - As a regular user, I want to play trivia games with other users to compare our knowledge and analytical skills. 
- Implement leaderboards
  - This is a nice to have feature, so we've left it to the last sprint.
  - As a user, I want to be able to view leaderboards based on my ACS score to see where I rank among all users. 
  
  
## Remarks on our release plan
Three key parameters we used to judge each feature and which sprint it should belong to are complexity, priority and dependency. Features that are dependent upon other features usually occur in a subsequent sprint. Features that are complex to implement also occur in the later sprints, this keeps us busy as we progressively learn. Finally, features, that have a high priority usually occur in the initial sprints (there are exceptions for example if a feature is complicated and dependent on other features it will be implemented in a later sprint even if its priority is high)

Also, the later sprints have fewer features, however, those features are significantly more difficult to implement and we've won't a reading week every sprint.

## Participants
All team members attended both meetings. At the end of the second meeting, we were all in agreement with this release plan.
