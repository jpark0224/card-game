# card-game

## Usage
### Deployed version
https://jpark0224.github.io/card-game/

### Local version
To clone and run this application, you'll need [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/en/) (which comes with npm) installed on your computer. From your command line:

```
# Clone this repository
$ git clone https://github.com/jpark0224/card-game.git

# Go into the repository
$ cd card-game

# Install dependencies
$ npm install

# Install http-server
$ npm install http-server -g

# Run http-server
$ http-server
```

Then go to your browser and type localhost:8080. Your Application should run there.

## Assumptions
1. A player going bust means that they are lost.
2. A single deck of cards has four suites: hearts, clubs, spades, diamonds. Each suite has thirteen cards: ace, 2, 3, 4, 5, 6, 7, 8, 9, 10, jack, queen and king.
3. A valid hand of cards does not go over 21 points.
4. A player chooses a value of ace based on their best interest. 
5. An integration test or end to end test is not necessary.
