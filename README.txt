TREASURE FINDER PROTOTYPE v0.1:
Both back- and front- ends are created in javascript as a single project.
The data store is simplified as a JSON file that is loaded in to memory as a hash map to simulate a database.
Linux and chrome was used as the platform for development. Other platforms may work but are yet untested.
Backend uses the library express to create a REST inteface to the treasure data.
Google maps is the map and treasure plotting provider for the UI.
The UI is written in vanilla JS for reasons of being a small project.
Very little effort was given in styling the UI, as this is a functional prototype.


PREREQUISITES:
- Node version capable of ES2017
- npm or yarn


HOW TO RUN WITH NPM:
go to the root directory of the project (where package.json is located) and type..
npm install
npm start

open browser at http://localhost:8000


HOW TO DEVELOP:
This means that the file system is being monitored for changes and the backend is restarted automatically for each change. 
The code is being syntax checked for each restart.
Simply type:
npm install
npm run dev-start

open browser at http://localhost:8000


HOW TO RUN TESTS:
npm install
npm run test


HOW TO RUN WITH YARN:
replace "npm" with "yarn" in the above mentioned examples.


DOCKER:
docker build . -t treasure:map
docker run -t -d -p 80:8000 treasure:map

open browser at http://localhost