import { Deck, Hand } from "./deck.js";

const cardContainer = document.querySelector(".card-container");
const score = document.querySelector(".score");
const bustMessage = document.querySelector(".bust");
const modal = document.querySelector(".modal");
const doubleAcesModal = document.querySelector(".double-aces-modal");
const oneBtn = document.querySelector(".one");
const elevenBtn = document.querySelector(".eleven");
const oneAndOneBtn = document.querySelector(".one-and-one");
const oneAndElevenBtn = document.querySelector(".one-and-eleven");

let deck, hand;

let valueSum = 0;
let numOfAce = 0;

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

  // reset valueSum and numOfAce
  valueSum = 0;
  numOfAce = 0;

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

  // score.innerHTML = evaluateOpeningHand(hand);
  evaluateOpeningHand();
  score.innerHTML = valueSum;
}

function evaluateOpeningHand() {
  for (let i = 0; i < hand.numberOfCards; i++) {
    valueSum += CARD_VALUE_MAP[hand.cards[i].value];
    if (hand.cards[i].value === "A") {
      numOfAce++;
    }
  }

  // two aces -> 2 (1 + 1) or 12 (1 + 11)
  if (numOfAce === 2) {
    doubleAcesModal.style.display = "block";
    oneAndOneBtn.onclick = function () {
      modal.style.display = "none";
    };
    oneAndElevenBtn.onclick = function () {
      valueSum += 10;
      score.innerHTML = valueSum;
      modal.style.display = "none";
    };
  } else if (numOfAce === 1) {
    // 1 ace and J, Q, K -> automatic win
    if (valueSum === 11) {
      valueSum += 10;
    }
    // 1 ace and number cards -> 1 or 11
    else {
      modal.style.display = "block";
      oneBtn.onclick = function () {
        modal.style.display = "none";
      };
      elevenBtn.onclick = function () {
        valueSum += 10;
        score.innerHTML = valueSum;
        modal.style.display = "none";
      };
    }
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

      evaluate();

      function evaluate() {
        valueSum += CARD_VALUE_MAP[newCard.value];

        if (newCard.value === "A") {
          numOfAce++;
          if (valueSum <= 11) {
            modal.style.display = "block";
            oneBtn.onclick = function () {
              modal.style.display = "none";
            };
            elevenBtn.onclick = function () {
              valueSum += 10;
              score.innerHTML = valueSum;
              modal.style.display = "none";
            };
          }
        }
      }

      // bust
      bust();

      function bust() {
        if (valueSum > 21) {
          disappearingMessage(score, valueSum);
          cardContainer.replaceChildren();
          hand.cards = [];

          disappearingMessage(bustMessage, "bust");

          hideButtons();
        }
      }

      // evaluate when not bust
      if (valueSum !== 0) {
        score.innerHTML = valueSum;
      }
    }
  } catch (e) {
    console.log(e);
  }
}

function stand() {
  try {
    if (hand.cards) {
      score.innerHTML = valueSum;
    }
  } catch (e) {
    console.log(e);
  }
}

function disappearingMessage(element, message) {
  element.innerHTML = message;
  setTimeout(() => {
    if (element.innerHTML === message || valueSum === 0) {
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

function openModal() {
  modal.style.display = "block";
}

// window.onclick = function (event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// };

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
    valueSum = 0;
    numOfAce = 0;
  });
}

export { startGame, hit, stand };
