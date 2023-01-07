import { Deck, Hand } from "./deck.js";

const cardContainer = document.querySelector(".card-container");
const score = document.querySelector(".score");
const bustMessage = document.querySelector(".bust");
const oneAceModal = document.querySelector(".one-ace-modal");
const doubleAcesModal = document.querySelector(".double-aces-modal");
const oneBtn = document.querySelector(".one");
const elevenBtn = document.querySelector(".eleven");
const oneAndOneBtn = document.querySelector(".one-and-one");
const oneAndElevenBtn = document.querySelector(".one-and-eleven");

let deck, hand;

let valueSum = 0;

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

  // reset valueSum
  valueSum = 0;

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

  // apply HTML to cards in hand

  applyHTML();

  function applyHTML() {
    for (let card of hand.cards) {
      cardContainer.appendChild(card.getHTML());
    }
  }

  evaluateOpeningHand();

  function evaluateOpeningHand() {
    for (let i = 0; i < hand.numberOfCards; i++) {
      valueSum += CARD_VALUE_MAP[hand.cards[i].value];
    }

    // two aces -> 2 (1 + 1) or 12 (1 + 11)
    if (hand.getNumberOfAces() === 2) {
      handleModal(doubleAcesModal, oneAndOneBtn, oneAndElevenBtn);
    } else if (hand.getNumberOfAces() === 1) {
      // 1 ace and J, Q, K -> automatic win
      if (valueSum === 11) {
        valueSum += 10;
      }
      // 1 ace and number cards -> 1 or 11
      else {
        handleModal(oneAceModal, oneBtn, elevenBtn);
      }
    }
  }

  score.innerHTML = valueSum;
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
          if (valueSum <= 11) {
            handleModal(oneAceModal, oneBtn, elevenBtn);
          }
        }
      }

      // bust
      bust();

      function bust() {
        if (valueSum > 21) {
          score.innerHTML = valueSum;

          bustMessage.innerHTML = "bust";

          hideButtons();
          startBtn.innerHTML = "Play again";
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

function hideButtons() {
  hitBtn.style.visibility = "hidden";
  standBtn.style.visibility = "hidden";
  startBtn.style.display = "inline";
  resetBtn.style.display = "none";
}

function handleModal(modal, buttonOne, buttonTwo) {
  modal.style.display = "block";
  buttonOne.onclick = function () {
    modal.style.display = "none";
  };
  buttonTwo.onclick = function () {
    valueSum += 10;
    score.innerHTML = valueSum;
    modal.style.display = "none";
  };
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
    valueSum = 0;
    startBtn.innerHTML = "Start";
  });
}

export { startGame, hit, stand };
