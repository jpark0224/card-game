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

  draw(card) {
    this.cards.push(card);
  }

  evaluate() {
    try {
      let valueSum = 0;
      for (let i = 0; i < this.numberOfCards; i++) {
        valueSum += CARD_VALUE_MAP[this.cards[i].value];
        if (this.cards[i].value === "A" && valueSum <= 11) {
          valueSum += 10;
        }
      }
      return valueSum;
    } catch (e) {
      console.log(e);
    }
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
