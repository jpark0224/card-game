const SUITS = ["♦", "♣", "♥", "♠"];
const VALUES = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

class Deck {
  constructor(cards = freshDeck()) {
    this.cards = cards;
  }

  get numberOfCards() {
    return this.cards.length;
  }

  shuffle() {
    for (let i = this.numberOfCards - 1; i > 0; i--) {
      // get the random index before the current card
      const newIndex = Math.floor(Math.random() * (i + 1));
      // swap cards
      const tmp = this.cards[newIndex];
      this.cards[newIndex] = this.cards[i];
      this.cards[i] = tmp;
    }
  }
}

class Hand {
  constructor(cards = []) {
    this.cards = cards;
  }

  get numberOfCards() {
    return this.cards.length;
  }

  receiveCards(card) {
    if (card.length > 1) {
      this.cards.push(...card);
    } else {
      this.cards.push(card);
    }
  }

  getNumberOfAces() {
    let count = 0;
    for (const card of this.cards) {
      if (card.value === "A") {
        count++;
      }
    }
    return count;
  }
}

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  get color() {
    return this.suit === "♣" || this.suit === "♠" ? "black" : "red";
  }

  getHTML() {
    const cardDiv = document.createElement("div");
    cardDiv.innerText = this.suit;
    cardDiv.classList.add("card", this.color);
    cardDiv.dataset.value = `${this.value} ${this.suit}`;
    return cardDiv;
  }
}

function freshDeck() {
  // using flatmap here to flatten the result by one level
  return SUITS.flatMap((suit) => {
    return VALUES.map((value) => {
      return new Card(suit, value);
    });
  });
}

export { Deck, Hand, Card };
