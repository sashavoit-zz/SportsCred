## Meeting goal

During our sprint 3 planning meeting we identified our goals for sprint 3, selected the user stories to be completed, estimated each of the stories using the Fibonacci scale, and assigned tasks to team members

## Sprint 3 goal

Having added extra functionality to our skeleton last sprint, we are now working on finalizing details in the main components of our app. We intend to finalize all features required for maintaining a basic profile. This includes adding a profile picture, viewing acs history, view post and debate history, as well as sending friend requests to others. We are also going to add more user connectivity in open court/debate where users will be able to like and dislike others posts. Picks and predictions will also be extended to allow users to choose playoff seeds. The entire leaderboards component to the app will also be finalized this sprint.

## Sprint 3 user stories

We picked 12 stories for Sprint 3 and broke them down into subtasks (back-end, front-end related subtasks and CRC cards related subtasks). These stories build on the functionality of Sprint 1 and 2’s stories (with the exception of leaderboards which is just being added). There is also a task that was assigned to help with some side tasks.

Each team member has 1-5 user stories to complete (Most team members have 1 story/task and three have more than one story- this is because some user stories could be easily implemented once another has been completed). We aimed to distribute work equally, but more importantly we aimed to assign stories based on what each team member already worked on so far in the project. For example, it would make more sense for someone who worked on open court in Sprint 2 to continue building it in Sprint 3. This way we are more efficient with completion times as the team member is more familiar with the underlying processes. Each story ranged from 3 to 20 points to accomplish. The total team capacity is 95 points.

1. (13 pts, Kevin) As a regular user, I want to send a friend request to other users to keep in touch and keep track of their ACS performance.
    * Front-end: Add interface feature to prompt users to send and receive requests
    * Back-end: Verify that a request is being sent via back-end and request received successfully
    * CRC: Make appropriate additions/modifications to CRC structure
2. (3 pts, Wisam) As a regular user, I want to be able to like/dislike debate threads to show support/opposition for debate topics or indicate a poorly chosen topic
    * Front-end: Add like/dislike GUI feature for debate
    * Back-end: Ensure this post interactivity is recorded in DB
    * CRC: Make appropriate additions/modifications to the CRC structure
3. (3 pts, Wisam) As a regular user, I want to be able to like/dislike comments in debate threads to show support/opposition for a particular argument
    * Front-end: Add like/dislike GUI feature for debate comment
    * Back-end: Ensure this comment interactivity is recorded in DB
    * CRC: Make appropriate additions/modifications to the CRC structure
4. (5 pts, Anand) As a regular user, I want to be able to pick eastern and western conference playoff seeds to see if I can guess the outcomes correctly
    * Front-end: Create GUI to enable users to pick playoff seeds
    * Back-end: Verify that the pick selections are consistent and stored in DB
    * CRC: Make appropriate additions/modifications to the CRC structure
5. (20 pts, Song) As a regular user, I want to view my ACS score history to track and evaluate my performance
    * Front-end: Create interface to allow users to see acs history in profile
    * Back-end: Ensure that acs history is efficiently stored in the DB
    * CRC: Make appropriate additions/modifications to the CRC structure
6. (5 pts, Song) As a regular user, I want to view my Post and Debate history to track and evaluate my performance
    * Front-end: Similar to the above story make sure there is a GUI for to see this
    * Back-end: Ensure that post/debate history is efficiently stored in the DB
    * CRC: Make appropriate additions/modifications to the CRC structure
7. (13 pts, Yiffy) As a regular user, I want to be able to update my profile picture to show other users 
    * Front-end: Create GUI to allow users to upload profile picture
    * Back-end: Verify that the picture is stored in db and that it appears in profile
    * CRC: Make appropriate additions/modifications to the CRC structure
8. (13 pts, Ben) As a user, I want to be able view leaderboards based on ACS score to see where I rank among all users
    * Front-end: Create leaderboard GUI to show top rankers within the app
    * Back-end: Ensure that data is being fetched correctly from DB
    * CRC: Make appropriate additions/modifications to the CRC structure
9. (1 pts, Ben) As a hardcore sports fan, I want to be able to view my rank amongst other hardcore sports fans to see how my knowledge compares to others
    * Front-end: Create leaderboard GUI to show ranking amongst pro users
    * Back-end: Ensure that data is being fetched correctly from DB
    * CRC: Make appropriate additions/modifications to the CRC structure
10. (1 pts, Ben) As a user, I want to be able to view the overall leaderboard to see how I compare to everyone using the app
    * Front-end: Create leaderboard GUI to show ranking amongst global users
    * Back-end: Ensure that data is being fetched correctly from DB
    * CRC: Make appropriate additions/modifications to the CRC structure
11. (1 pts, Ben) As a mediocre sports fan, I want to be able to view my rank amongst other mediocre sports fans to see how my knowledge compares to others
    * Front-end: Create leaderboard GUI to show ranking amongst mid-tiered users
    * Back-end: Ensure that data is being fetched correctly from DB
    * CRC: Make appropriate additions/modifications to the CRC structure
12. (1 pts, Ben) As a light sports fan, I want to be able to view my rank amongst other light sports fans to see how my knowledge compares to others
    * Front-end: Create leaderboard GUI to show ranking amongst low-tiered users
    * Back-end: Ensure that data is being fetched correctly from DB
    * CRC: Make appropriate additions/modifications to the CRC structure
    
## Sprint 3 tasks

We needed to allocate some time for a single task to fix complications that we faced in sprint 2.

1. (8 pts, Sasha) Set up real-time notification service for results of picks & predictions
    * Front-end: N/A
    * Back-end: Create a service that allows developers to queue notifications into the notifications bar
    * CRC: Make appropriate additions/modifications to the CRC structure

## Attendance

Ben, Sasha, Song, Wisam, Yiffy, Kevin, and Anand were present in the meeting during the tutorial. All decisions made during the Sprint 3 planning meeting were down collectively and to everyone’s satisfaction.

## Spikes

No spikes in this sprint
