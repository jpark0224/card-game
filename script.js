import Deck from "./deck.js";

const cardContainer = document.querySelector(".card-container");
const deckElement = document.querySelector(".player-deck");
let deck;
let numOfCardsInHand = 0;

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

function startGame() {
  deck = new Deck();
  deck.shuffle();
  console.log(deck.cards);

  cardContainer.appendChild(deck.cards[0].getHTML());
  cardContainer.appendChild(deck.cards[1].getHTML());
  numOfCardsInHand = 2;
  console.log(countValues());
}

// count total values of cards dealt so far (not taking Ace into consideration)
function countValues() {
  let valueSum = 0;
  for (let i = 0; i < numOfCardsInHand; i++) {
    valueSum += CARD_VALUE_MAP[deck.cards[i].value];
  }
  return valueSum;
}

function hit() {
  numOfCardsInHand++;
  // append card
  cardContainer.appendChild(deck.cards[numOfCardsInHand - 1].getHTML());
  if (countValues() > 21) {
    console.log("bust");
  }
  console.log(countValues());
}

// maximum number of cards a player can hold
// 11, four aces, four 2s and three 3s.

// event listners
const startBtn = document.querySelector(".start");
startBtn.addEventListener("click", startGame);
const hitBtn = document.querySelector(".hit");
hitBtn.addEventListener("click", hit);
// const standBtn = document.querySelector(".stand");
// standBtn.addEventListener("click", stand);
