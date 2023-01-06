import { Deck, Hand } from "./deck.js";

const cardContainer = document.querySelector(".card-container");
const score = document.querySelector(".score");
const bustMessage = document.querySelector(".bust");

let deck, hand;

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

  score.innerHTML = hand.evaluate();
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
        if (hand.evaluate() > 21) {
          disappearingMessage(score, hand.evaluate());
          cardContainer.replaceChildren();
          hand.cards = [];

          disappearingMessage(bustMessage, "bust");

          hideButtons();
        }
      }

      // evaluate when not bust
      if (hand.evaluate() !== 0) {
        score.innerHTML = hand.evaluate();
      }
    }
  } catch (e) {
    console.log(e);
  }
}

function stand() {
  try {
    if (hand.cards) {
      score.innerHTML = hand.evaluate();
    }
  } catch (e) {
    console.log(e);
  }
}

function disappearingMessage(element, message) {
  element.innerHTML = message;
  setTimeout(() => {
    if (element.innerHTML === message || hand.evaluate() === 0) {
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

export { startGame, hit, stand };
