# Blackjack

![blackjack-title](https://user-images.githubusercontent.com/86682774/211224291-2da7e709-ba8c-459a-b55e-4725b8bb2646.png)
![blackjack-play-screen](https://user-images.githubusercontent.com/86682774/211224305-7d868d23-89cc-490c-a249-2159665d0b6b.png)

## Table of contents

- [Introduction](#introduction)
- [Usage](#usage)
- [Assumptions](#assumptions)
- [Known issues and limitations](#known-issues-and-limitations)
- [Future improvements](#future-improvements)
- [Author](#author)

## Introduction

A Blackjack card game based on object-oriented programming, test-driven development, and agile methodologies. 
A kanban board was used to manage the progress as in the screenshot below.

![Screenshot 2023-01-07 004853](https://user-images.githubusercontent.com/86682774/211225096-2a79ecba-0713-4ff2-b180-60055fa7bb3a.png)

### Built with

- HTML5
- CSS3
- JavaScript

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
1. A single deck of cards has four suites: hearts, clubs, spades, diamonds. Each suite has thirteen cards: ace, 2, 3, 4, 5, 6, 7, 8, 9, 10, jack, queen and king.
2. A valid hand of cards is at most 21 points.
3. The player beats the dealer when they have a valid hand of cards in the below scenarios:
* The player’s score is higher than dealer’s but less than or equal to 21.
* The dealer busted.
4. When the player scores 21, they can tie with or beat the dealer.
5. The player loses when they have a valid hand of cards in the below scenarios:
* The player’s score is lower than dealer's and the dealer's score is less than or equal to 21.
* The player busted.
6. The player chooses a value of ace based on their best interest:
* When the sum of the rest of the card values is 10, an ace is counted as 11. 
* When the sum of the rest of the card values is greater than or equal to 11, an ace is counted as 1.
7. The player or dealer can hit more than once.
8. The player can stand after hitting. 
9. Standing ends the player’s turn.
10. The deck is shuffled after every round.
11. If the dealer has a hand total of 17 or higher, they will automatically stand. If the dealer has a hand total of 16 or lower, they will take additional hit cards.
12. An integration test or end-to-end test is not necessary.

## Known issues and limitations

- The game is not responsive. The recommended setting is a browser height of 900px and over.
- When the dealer hits more than once, the additional cards are shown at the same time.
- Timeouts are not cancelled when the relevant round is over.

## Future improvements
- To make the game responsive across all devices.
- To allow for multiple players
-	To allow for rule variations
- To add for chips and betting
- To add round history
- To add visual effects
- To add sound effects

## Author

👤 **Julie Park**

- LinkedIn: [@julie-park-developer](https://www.linkedin.com/in/julie-park-developer/)
- Github: [@jpark0224](https://github.com/jpark0224)
