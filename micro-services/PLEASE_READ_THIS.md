READ INSTRUCTIONS:

INSTRUCTIONS:
- These are the 'proposed' microservices. You can add/remove if you feel necessary just make sure to add it to the MODIFICATION LOG below (think twice about adding/removing
microservices as the current structure satisfies an ideal design structure as expected by our professor/TAs)
- The microservice names may be confusing or too vague to interpret so below are descriptions to undersand the purpose of each one

MODIFICATION LOG:
- (microservice_name, modification_type, reason, date)
- 

API Gateway: manage/redirect flow of API calls from client

SERVICES:
Database management service
Main responsibility: Connect any high-level service with DB (this way we can avoid multiple direct connections to the db- this way if there is a schema change in the db we don’t have to change all services and rather we just modify the database service)

User management service
Main responsibility: responsible for handling any requests related to the users of the application
    This will contain microservices:
        Profile management microservice 

ACS management service
Main responsibility: all relevant regulations and calculations concerning the ACS score. 
This service contains schemas regarding ACS and hence it would handle all processing of ACS (ie, modifying an ACS after doing poorly on a trivia game)
This will also handle filtering and sorting of ACS so that leaderboard functionality is simpler

Publication management service 
Main responsibility: handling any requests related to the posts in the open court.
This service handles all functionality concerning posts and their attributes (comments, likes, dislikes)
Ask about comment discussions

Picks/Predict management service
Main responsibility: handling user’s daily picks and the actual result

Authentication management service
Main responsibility: authenticate when users sign in/sign up, recover users’ password.

Sharing management service
Main responsibility: This service handles all functionality involving sharing SportCred posts to external apps and vice versa. This service is used to communicate between entities of the app and external apps

Trivia management service
Main responsibility: handles all functionality concerning the trivia mini games.
It contains the schemas and standards that operate the trivia component and so it will handle question selection and requests of that type

Search management service
Main responsibility: handles requests related to search
This service handles functionalities such as search by tag, search by name, and filters the search result. 

User-to-User management service
Main responsibility: This service will handle communication between multiple users (clients)
This includes: 
sending and receiving friend requests.
Playing trivia games together
Note: this is different from communication between users on a public forum (post management)