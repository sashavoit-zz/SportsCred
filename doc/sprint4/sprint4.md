## <span style="text-decoration:underline;">Meeting goal</span>

During our sprint 4 planning meeting we identified our goals for sprint 4, selected the user stories to be completed, estimated each of the stories using the Fibonacci scale, and assigned tasks to team members. Our general approach was to ensure all team members are onboard with every decision made towards the development of the application.


## <span style="text-decoration:underline;">Sprint 4 goal</span>

Given that this is our last sprint we decided to forgo the implementation of all key user stories (left in the product backlog) required for the absolute functionality of the app. We intend to implement multiplayer trivia where users can invite each other to compete in head to head trivia games. In profile we will allow users to view their debate history. We are also looking to implement commenting functionality within debate so that users can discuss popular sport topics. We will also implement hashtags into posts. This sprint we are also implementing a search feature that will allow users to search for posts by matching keywords. Finally, we will allow users to upload pictures within posts for open court.


## Spikes



1. Implement notifications for different components
*   This is a spike because not every feature (like The Zone’s comment reply, like, dislikes) needs to trigger a notification. We didn’t know ahead of time how much work this task would require so instead of making it a task we made this a spike.
2. Improve overall UI
*   This is a spike because the requirements are clear. We know we have to improve our UI, but we aren’t sure how we would do this, so we don’t know how much work it would take.


## Participants

Ben, Sasha, Song, Wisam, Yiffy, Kevin, and Anand were present in the meeting during the tutorial. All decisions made during the Sprint 4 planning meeting were done collectively and to everyone’s satisfaction.


## <span style="text-decoration:underline;">Sprint 4 user stories</span>

We picked 8 stories for Sprint 4 and broke them down into subtasks (back-end, front-end related subtasks and CRC cards related subtasks). These stories build on the functionality of Sprint 1, 2, and 3’s stories. There are also some tasks and spikes introduced to improve the overall quality of the app.

Each team member has 1-3 user stories to complete (Most team members have 1 story/task while some have 2-3- this is because some user stories could be easily implemented once another has been completed). We aimed to distribute work equally, but more importantly we aimed to assign stories based on what each team member already worked on so far in the project. For example, it would make more sense for someone who worked on trivia in Sprint 1 to work on multiplayer trivia in Sprint 4. This way we are more efficient with completion times as the team member is more familiarized with the underlying processes. Each story ranged from 1 to 20 points to accomplish. The total **team capacity is 69 points.**



1. (20 pts, Ben & Sasha) As a regular user, I want to play trivia games with other users to compare our knowledge and analytical skills
*   Front-end: Modify interface for 2 players and bind backend endpoints to frontend
*   Back-end: Create a long-polling system that allows for user-to-user communication
*   CRC: make appropriate additions/modifications to CRC structure
2. (5 pts, Song) As a regular user, I want to view my Debate history to track and evaluate my performance
*   Front-end: Ensure user is able to view debate history within profile in a table
*   Back-end: Verify that debate history is stored correctly in DB
*   CRC: make appropriate additions/modifications to CRC structure
3. (2 pts, Wisam) As a hardcore sports fan, I want to be able to discuss sports topics with other hardcore sports fans in a debate’s comments to be able to state my opinion and its reasoning
*   Front-end: Ensure users are able to comment below debate posts
*   Back-end: Ensure comment is stored in association with a specific debate topic
*   CRC: make appropriate additions/modifications to CRC structure
4. (1 pt, Wisam) As a mediocre sports fan, I want to be able to discuss sports topics with other mediocre sports fans in a debate’s comments to be able to state my opinion and its reasoning
*   Front-end: Ensure users are able to comment below debate posts
*   Back-end: Ensure comment is stored in association with a specific debate topic
*   CRC: make appropriate additions/modifications to CRC structure
5. (1 pt, Wisam) As a light sports fan, I want to be able to discuss sports topics with other light sports fans in a debate’s comments to be able to state my opinion and its reasoning
*   Front-end: Ensure users are able to comment below debate posts
*   Back-end: Ensure comment is stored in association with a specific debate topic
*   CRC: make appropriate additions/modifications to CRC structure
6. (2 pts, Yiffy) As a regular user, I want to be able to put hashtags in my post to specify the content of my post
*   Front-end: Ensure that people can produce appropriate hashtags
*   Back-end: Verify that application is able to identify and process hashtags
*   CRC: make appropriate additions/modifications to CRC structure
7. (20 pts, Kevin & Anand) As a regular user, I want to be able to search for posts by searching for matching words in a post's content to find topics that I’m interested in, so I quickly find topics I’m interested in
*   Front-end: Make search bar viewable in nav bar
*   Back-end: Ensure application is able to recognize keywords in stored posts
*   CRC: make appropriate additions/modifications to CRC structure
8. (5 pts, Yiffy) As a regular user, I want to be able to upload pictures to posts in open court
*   Front-end: Verify that image is uploaded correctly to a post in open court
*   Back-end: Ensure an image is stored correctly after being posted
*   CRC: make appropriate additions/modifications to CRC structure


## <span style="text-decoration:underline;">Sprint 4 tasks</span>

We needed to allocate some time for a single task to fix complications that we faced in previous sprints.



1. (13 pts, Song) Integrate ACS with all components
*   Front-end: Ensure live ACS is displayed
*   Back-end: Call endpoints responsible for keeping acs updated
*   CRC: make appropriate additions/modifications to CRC structure
