import { Deck, Hand } from "./deck.js";

const cardContainer = document.querySelector("#card-container");
const playerCardContainer = document.querySelector("#player-card-container");
const dealerCardContainer = document.querySelector("#dealer-card-container");
const gameInfo = document.querySelector("#game-info-container");
const playerScore = document.querySelector("#player-score .score-span");
const dealerScore = document.querySelector("#dealer-score .score-span");
const singleAceModal = document.querySelector("#single-ace-modal");
const doubleAcesModal = document.querySelector("#double-aces-modal");
const messageModal = document.querySelector("#message-modal");
const modalMessage = document.querySelector(".modal-message");
const close = document.querySelector(".close");
const oneBtn = document.querySelector("#one");
const elevenBtn = document.querySelector("#eleven");
const oneAndOneBtn = document.querySelector("#one-and-one");
const oneAndElevenBtn = document.querySelector("#one-and-eleven");
const titleContainer = document.querySelector("#title-container");

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
    titleContainer.style.display = "none";
  }

  // make a new deck
  getNewDeck();

  function getNewDeck() {
    deck = new Deck();
    deck.shuffle();
  }

  // deal opening hands
  dealOpeningHand(playerHand, [deck.cards[0], deck.cards[1]]);
  dealOpeningHand(dealerHand, [deck.cards[2], deck.cards[3]]);

  function dealOpeningHand(hand, cards) {
    hand.receiveCards(cards);
  }

  // apply HTML to cards in hands
  applyPlayerHTML(playerHand, playerCardContainer);
  applyDealerHTML(dealerHand, dealerCardContainer);

  function applyPlayerHTML(hand, container) {
    container.appendChild(hand.cards[0].getFrontHTML());
    setTimeout(function () {
      container.appendChild(hand.cards[1].getFrontHTML());
    }, 500);
  }

  function applyDealerHTML(hand, container) {
    container.append(getPlaceHolderHTML(), getPlaceHolderHTML());
    setTimeout(function () {
      container.replaceChildren();
      container.appendChild(getBackHTML());
    }, 1000);
    setTimeout(function () {
      container.appendChild(hand.cards[1].getFrontHTML());
    }, 1500);

    function getBackHTML() {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("back-of-card");
      return cardDiv;
    }

    function getPlaceHolderHTML() {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("space-holder");
      return cardDiv;
    }
  }

  // evaluate player opening hand and update score
  playerValueSum += evaluateOpeningHand(playerHand);
  playerScore.innerHTML = playerValueSum;
  dealerScore.innerHTML = "?";

  function evaluateOpeningHand(hand) {
    let valueSum = 0;
    for (let i = 0; i < hand.numberOfCards; i++) {
      valueSum += CARD_VALUE_MAP[hand.cards[i].value];
    }

    // two aces -> 2 (1 + 1) or 12 (1 + 11)
    if (hand.getNumberOfAces() === 2) {
      setTimeout(
        handleAceModal,
        2000,
        doubleAcesModal,
        oneAndOneBtn,
        oneAndElevenBtn
      );
    } else if (hand.getNumberOfAces() === 1) {
      // 1 ace and 10, J, Q, K -> blackjack
      if (valueSum === 11) {
        valueSum += 10;
        handleMessageModal("Blackjack!");
      }
      // 1 ace and number cards from 2 to 9 -> 1 or 11
      else {
        setTimeout(handleAceModal, 2000, singleAceModal, oneBtn, elevenBtn);
      }
    }
    return valueSum;
  }
}

function hit() {
  if (playerHand.cards && playerValueSum <= 21) {
    // receive card
    let newCard =
      deck.cards[playerHand.numberOfCards + dealerHand.numberOfCards];
    playerHand.receiveCards(newCard);

    // apply HTML to the new card
    playerCardContainer.appendChild(newCard.getFrontHTML());

    // evaluate hand
    evaluateHand();

    function evaluateHand() {
      playerValueSum += CARD_VALUE_MAP[newCard.value];

      if (newCard.value === "A") {
        if (playerValueSum < 11) {
          handleAceModal(singleAceModal, oneBtn, elevenBtn);
        } else if (playerValueSum === 11) {
          playerValueSum += 10;
        }
      }

      playerScore.innerHTML = playerValueSum;
    }

    // handle bust
    handleBust();

    function handleBust() {
      if (playerValueSum > 21) {
        // flip a face down card from dealer's opening hand
        flipDealerCard();

        setTimeout(handleMessageModal, 1000, "You busted. Dealer won!");

        // handle buttons
        hideButtons();
        startBtn.innerHTML = "Play again";
      }
    }
  } else {
    handleMessageModal("You need a valid hand to hit.");
  }
}

function stand() {
  if (playerHand.cards && playerValueSum <= 21) {
    // handle buttons
    hideButtons();
    startBtn.innerHTML = "Play again";

    // flip a face down card from dealer's opening hand
    flipDealerCard();

    // If the dealer has a hand total of 17 or higher, they will automatically stand.
    // If the dealer has a hand total of 16 or lower, they will take additional hit-cards.
    dealerHit();

    function dealerHit() {
      if (dealerScore.innerHTML < 17) {
        let newCard =
          deck.cards[playerHand.numberOfCards + dealerHand.numberOfCards];

        // receive card
        dealerHand.receiveCards(newCard);

        // apply HTML to the new card
        setTimeout(function () {
          dealerCardContainer.appendChild(newCard.getFrontHTML());
        }, 500);

        dealerScore.innerHTML = evaluateDealerHand(dealerHand);

        // repeat until dealer's score is 17 or higher
        dealerHit();
      } else return;
    }

    compareScores();

    function compareScores() {
      const dealerScoreNum = Number(dealerScore.innerHTML);
      const playerScoreNum = Number(playerScore.innerHTML);

      if (dealerScoreNum > playerScoreNum) {
        if (dealerScoreNum > 21) {
          setTimeout(handleMessageModal, 1000, "Dealer busted. You won!");
        } else {
          setTimeout(handleMessageModal, 1000, "You lost. Maybe next time!");
        }
      } else if (dealerScoreNum === playerScoreNum) {
        setTimeout(handleMessageModal, 1000, "It's a tie!");
      } else if (dealerScoreNum < playerScoreNum) {
        setTimeout(handleMessageModal, 1000, "You won!");
      }
    }
  } else {
    handleMessageModal("You need a valid hand to stand.");
  }
}

function flipDealerCard() {
  dealerCardContainer.firstChild.remove();
  dealerCardContainer.prepend(dealerHand.cards[0].getFrontHTML());
  dealerScore.innerHTML = evaluateDealerHand(dealerHand);
}

function evaluateDealerHand(hand) {
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
    if (event.target === messageModal) {
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
  titleContainer.style.display = "grid";
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

export { evaluateDealerHand };
