import { Deck, Hand } from "./deck.js";

const cardContainer = document.querySelector(".card-container");
const score = document.querySelector(".score");
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

  showButtons();
  function showButtons() {
    hitBtn.style.visibility = "visible";
    standBtn.style.visibility = "visible";
    startBtn.style.display = "none";
    resetBtn.style.display = "inline";
  }

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
    console.log(e);
  }
}

function hit() {
  try {
    if (hand.cards) {
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

          hideButtons();
        }
      }

      // evaluate when not bust
      if (evaluate(hand) !== 0) {
        score.innerHTML = evaluate(hand);
      }
    }
  } catch (e) {
    console.log(e);
  }
}

function stand() {
  try {
    if (hand.cards) {
      score.innerHTML = evaluate(hand);
    }
  } catch (e) {
    console.log(e);
  }
}

function disappearingMessage(element, message) {
  element.innerHTML = message;
  setTimeout(() => {
    if (element.innerHTML === message || evaluate(hand) === 0) {
      element.innerHTML = "";
    }
  }, 1000);
}

function hideButtons() {
  hitBtn.style.visibility = "hidden";
  standBtn.style.visibility = "hidden";
  startBtn.style.display = "inline";
  resetBtn.style.display = "none";
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
const resetBtn = document.querySelector(".reset");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    cardContainer.replaceChildren();
    score.innerHTML = "";
    bustMessage.innerHTML = "";
    hand.cards = [];
    hideButtons();
  });
}

export { startGame, evaluate, hit, stand };
