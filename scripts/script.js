import { Deck, Hand } from "./deck.js";

const cardContainer = document.querySelector(".card-container");
const score = document.querySelector(".score");
const errorMessage = document.querySelector(".error-message");
const bustMessage = document.querySelector(".bust");

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
  // erase bust message if there was one
  bustMessage.innerHTML = "";

  // make a new deck

  getNewDeck();

  function getNewDeck() {
    cardContainer.replaceChildren();
    deck = new Deck();
    deck.shuffle();
  }

  // deal opening hand

  dealOpeningHand();

  function dealOpeningHand() {
    const openingHand = [deck.cards[0], deck.cards[1]];
    hand = new Hand(openingHand);
  }

  console.log(hand.cards);

  // apply HTML to cards in hand

  applyHTML();

  function applyHTML() {
    for (let card of hand.cards) {
      cardContainer.appendChild(card.getHTML());
    }
  }

  score.innerHTML = evaluate(hand);
}

// count total values of cards dealt so far (not taking Ace into consideration)
function evaluate(hand) {
  try {
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
  } catch (e) {
    if (e instanceof TypeError) {
      disappearingMessage(errorMessage, "Start game to evaluate cards");
    }
  }
}

function hit() {
  try {
    if (hand.cards) {
      if (evaluate(hand) === 0) {
        throw "You can't hit when busted";
      }

      let newCard = deck.cards[hand.numberOfCards - 1];

      // draw card
      hand.draw(newCard);

      // apply HTML to the new card
      cardContainer.appendChild(newCard.getHTML());

      // bust
      bust();

      function bust() {
        if (evaluate(hand) > 21) {
          disappearingMessage(score, evaluate(hand));
          cardContainer.replaceChildren();
          hand.cards = [];
          disappearingMessage(bustMessage, "bust");
        }
      }

      // evaluate when not bust
      if (evaluate(hand) !== 0) {
        score.innerHTML = evaluate(hand);
      }
    }
  } catch (e) {
    if (e instanceof TypeError) {
      disappearingMessage(errorMessage, "Start game to hit");
    } else {
      disappearingMessage(errorMessage, e);
    }
  }
}

function stand() {
  try {
    if (hand.cards) {
      if (evaluate(hand) === 0) {
        disappearingMessage(errorMessage, "You can't stand when busted");
      } else {
        score.innerHTML = evaluate(hand);
      }
    }
  } catch (e) {
    if (e instanceof TypeError) {
      disappearingMessage(errorMessage, "Start game to stand");
    } else {
      disappearingMessage(errorMessage, e);
    }
  }
}

function disappearingMessage(element, message) {
  element.innerHTML = message;
  setTimeout(() => {
    element.innerHTML = "";
  }, 1000);
}

// event listeners
const startBtn = document.querySelector(".start");
if (startBtn) {
  startBtn.addEventListener("click", startGame);
}
const hitBtn = document.querySelector(".hit");
if (hitBtn) {
  hitBtn.addEventListener("click", hit);
}
const standBtn = document.querySelector(".stand");
if (standBtn) {
  standBtn.addEventListener("click", stand);
}

export { startGame, evaluate, hit, stand };
