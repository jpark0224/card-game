import Deck from "./deck.js";

const cardOneSlot = document.querySelector(".card-one-slot");
const cardTwoSlot = document.querySelector(".card-two-slot");
const deckElement = document.querySelector(".player-deck");

const CARD_VALUE_MAP = {
  // later change A for player to choose between 1 and 11
  A: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 10,
  Q: 10,
  K: 10,
};

startGame();
function startGame() {
  const deck = new Deck();
  deck.shuffle();
}

const deck = new Deck();
deck.shuffle();
console.log(deck.cards);

cardOneSlot.appendChild(deck.cards[0].getHTML());
cardTwoSlot.appendChild(deck.cards[1].getHTML());

// function bust(
//   cardOne,
//   cardTwo,
//   cardThree,
//   cardFour,
//   cardFive,
//   cardSix,
//   cardSeven,
//   cardEight,
//   cardNine,
//   cardTen,
//   cardEleven
// ) {
//   return;
// }

// maximum number of cards a player can hold
// 11, four aces, four 2s and three 3s.
