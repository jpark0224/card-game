import { Deck, Hand } from "./deck.js";

const cardContainer = document.querySelector("#card-container");
const playerCardContainer = document.querySelector("#player-card-container");
const dealerCardContainer = document.querySelector("#dealer-card-container");
const gameInfo = document.querySelector("#game-info-container");
const playerScore = document.querySelector("#player-score .score-span");
const dealerScore = document.querySelector("#dealer-score .score-span");
const oneAceModal = document.querySelector("#single-ace-modal");
const doubleAcesModal = document.querySelector("#double-aces-modal");
const messageModal = document.querySelector("#message-modal");
const modalMessage = document.querySelector(".modal-message");
const close = document.querySelector(".close");
const oneBtn = document.querySelector("#one");
const elevenBtn = document.querySelector("#eleven");
const oneAndOneBtn = document.querySelector("#one-and-one");
const oneAndElevenBtn = document.querySelector("#one-and-eleven");

let deck;
let playerHand = new Hand();
let dealerHand = new Hand();

let playerValueSum = 0;

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
  reset();

  showButtons();

  function showButtons() {
    hitBtn.style.display = "inline";
    standBtn.style.display = "inline";
    startBtn.style.display = "none";
    resetBtn.style.display = "inline";
    gameInfo.style.display = "inline";
    cardContainer.style.display = "block";
  }

  // make a new deck

  getNewDeck();

  function getNewDeck() {
    playerCardContainer.replaceChildren();
    deck = new Deck();
    deck.shuffle();
  }

  console.log(deck);

  // deal opening hand

  dealOpeningHand(playerHand, [deck.cards[0], deck.cards[1]]);
  dealOpeningHand(dealerHand, [deck.cards[2], deck.cards[3]]);

  function dealOpeningHand(hand, cards) {
    hand.receiveCards(cards);
  }

  // apply HTML to cards in hand

  applyPlayerHTML(playerHand, playerCardContainer);
  applyDealerHTML();

  function applyPlayerHTML(hand, container) {
    for (let card of hand.cards) {
      container.appendChild(card.getFrontHTML());
    }
  }

  function applyDealerHTML() {
    dealerCardContainer.appendChild(dealerHand.cards[0].getBackHTML());
    dealerCardContainer.appendChild(dealerHand.cards[1].getFrontHTML());
  }

  function evaluateOpeningHand(hand) {
    let valueSum = 0;
    for (let i = 0; i < hand.numberOfCards; i++) {
      valueSum += CARD_VALUE_MAP[hand.cards[i].value];
    }

    // two aces -> 2 (1 + 1) or 12 (1 + 11)
    if (hand.getNumberOfAces() === 2) {
      handleAceModal(doubleAcesModal, oneAndOneBtn, oneAndElevenBtn);
    } else if (hand.getNumberOfAces() === 1) {
      // 1 ace and J, Q, K -> automatic win
      if (valueSum === 11) {
        valueSum += 10;
      }
      // 1 ace and number cards -> 1 or 11
      else {
        handleAceModal(oneAceModal, oneBtn, elevenBtn);
      }
    }
    return valueSum;
  }

  playerValueSum += evaluateOpeningHand(playerHand);

  playerScore.innerHTML = playerValueSum;

  if (playerValueSum === 21) {
    handleMessageModal("Blackjack!");
  }
}

function evaluateDealer(hand) {
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
  if (playerHand.cards) {
    let newCard =
      deck.cards[playerHand.numberOfCards + dealerHand.numberOfCards];

    // receive card
    playerHand.receiveCards(newCard);

    // apply HTML to the new card
    playerCardContainer.appendChild(newCard.getFrontHTML());

    evaluate();

    function evaluate() {
      playerValueSum += CARD_VALUE_MAP[newCard.value];

      if (newCard.value === "A") {
        if (playerValueSum <= 11) {
          handleAceModal(oneAceModal, oneBtn, elevenBtn);
        }
      }
    }

    // bust
    bust();

    function bust() {
      if (playerValueSum > 21) {
        // flip the card of dealer
        dealerScore.innerHTML = evaluateDealer(dealerHand);
        dealerCardContainer.firstChild.remove();
        dealerCardContainer.prepend(dealerHand.cards[0].getFrontHTML());

        playerScore.innerHTML = playerValueSum;

        handleMessageModal("You busted. Dealer won!");

        hideButtons();

        startBtn.innerHTML = "Play again";
      }
    }

    // evaluate when not bust
    if (playerValueSum !== 0) {
      playerScore.innerHTML = playerValueSum;
    }
  }
}

function stand() {
  hideButtons();

  // flip the card of dealer
  dealerScore.innerHTML = evaluateDealer(dealerHand);
  dealerCardContainer.firstChild.remove();
  dealerCardContainer.prepend(dealerHand.cards[0].getFrontHTML());

  // If the dealer has a hand total of 17 or higher, they will automatically stand.
  // If the dealer has a hand total of 16 or lower, they will take additional hit-cards.
  dealerHit();

  compareScores();
}

function dealerHit() {
  if (dealerScore.innerHTML < 17) {
    let newCard =
      deck.cards[playerHand.numberOfCards + dealerHand.numberOfCards];

    // receive card
    dealerHand.receiveCards(newCard);

    // apply HTML to the new card
    dealerCardContainer.appendChild(newCard.getFrontHTML());

    dealerScore.innerHTML = evaluateDealer(dealerHand);

    // repeat until dealer's score is over 17
    dealerHit();
  }
}

function compareScores() {
  startBtn.innerHTML = "Play again";

  if (dealerScore.innerHTML > playerScore.innerHTML) {
    if (dealerScore.innerHTML > 21) {
      handleMessageModal("Dealer busted. You won!");
    } else {
      handleMessageModal("You lost. Maybe next time!");
    }
  } else if (dealerScore.innerHTML === playerScore.innerHTML) {
    handleMessageModal("It's a tie!");
  } else if (dealerScore.innerHTML < playerScore.innerHTML) {
    handleMessageModal("You won!");
  }
}

function hideButtons() {
  hitBtn.style.display = "none";
  standBtn.style.display = "none";
  startBtn.style.display = "inline";
  resetBtn.style.display = "none";
}

function handleAceModal(modal, buttonOne, buttonTwo) {
  modal.style.display = "block";
  buttonOne.onclick = function () {
    modal.style.display = "none";
  };
  buttonTwo.onclick = function () {
    playerValueSum += 10;
    playerScore.innerHTML = playerValueSum;
    modal.style.display = "none";
  };
}

function handleMessageModal(message) {
  modalMessage.innerHTML = message;
  messageModal.style.display = "block";
  close.onclick = function () {
    messageModal.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == messageModal) {
      messageModal.style.display = "none";
    }
  };
}

function reset() {
  playerCardContainer.replaceChildren();
  dealerCardContainer.replaceChildren();
  playerScore.innerHTML = "";
  dealerScore.innerHTML = "";
  playerHand.cards = [];
  dealerHand.cards = [];
  hideButtons();
  gameInfo.style.display = "none";
  cardContainer.style.display = "none";
  playerValueSum = 0;
}

// event listeners
const startBtn = document.querySelector("#start");
if (startBtn) {
  startBtn.addEventListener("click", startGame);
}
const hitBtn = document.querySelector("#hit");
if (hitBtn) {
  hitBtn.addEventListener("click", hit);
}
const standBtn = document.querySelector("#stand");
if (standBtn) {
  standBtn.addEventListener("click", stand);
}
const resetBtn = document.querySelector("#reset");
if (resetBtn) {
  resetBtn.addEventListener("click", reset);
}
