import Deck from "./deck.js";
import Hand from "./deck.js";

const cardContainer = document.querySelector(".card-container");
let deck, hand;

const CARD_VALUE_MAP = {
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
  // make a new deck
  cardContainer.replaceChildren();
  deck = new Deck();
  deck.shuffle();

  // deal opening hand
  const openingHand = [deck.cards[0], deck.cards[1]];
  hand = new Hand(openingHand);

  // apply HTML to cards in hand
  for (let card of hand.cards) {
    cardContainer.appendChild(card.getHTML());
  }

  console.log(evaluate());
}

// count total values of cards dealt so far (not taking Ace into consideration)
function evaluate() {
  let valueSum = 0;
  for (let i = 0; i < hand.numberOfCards; i++) {
    valueSum += CARD_VALUE_MAP[hand.cards[i].value];
    // handle ace
    // Count aces as 1
    // If the hand contains an ace and the total is currently <= 11, add 10.
    // for the first two dealt cards, ace is always 11.
    if (hand.cards[i].value === "A" && valueSum <= 11) {
      valueSum += 10;
    }
  }
  return valueSum;
}

function hit() {
  let newCard = deck.cards[hand.numberOfCards - 1];

  // deal card
  hand.dealCard(newCard);

  // apply HTML to the new card
  cardContainer.appendChild(newCard.getHTML());

  // bust
  if (evaluate() > 21) {
    cardContainer.replaceChildren();
    hand.cards = [];
    console.log("bust");
  }
  console.log(evaluate());
}

function stand() {
  console.log(evaluate());
}

// event listeners
const startBtn = document.querySelector(".start");
startBtn.addEventListener("click", startGame);
const hitBtn = document.querySelector(".hit");
hitBtn.addEventListener("click", hit);
const standBtn = document.querySelector(".stand");
standBtn.addEventListener("click", stand);
