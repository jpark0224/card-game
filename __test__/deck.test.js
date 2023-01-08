import { Deck, Hand, Card } from "../scripts/deck";

describe("Deck", () => {
  let deck;

  beforeEach(() => {
    deck = new Deck();
  });

  test("The number of cards in one deck should be 52", () => {
    expect(deck.numberOfCards).toBe(52);
  });

  test("A deck can be shuffled", () => {
    let originalDeck = deck;
    let clonedDeck = structuredClone(originalDeck);
    originalDeck.shuffle();

    for (let i = 0; i < originalDeck.numberOfCards; i++) {
      expect(originalDeck.cards[i]).not.toBe(clonedDeck.cards[i]);
    }
  });
});

describe("Hand", () => {
  test("The number of cards in one hand before dealing cards should be 0", () => {
    const hand = new Hand();

    expect(hand.numberOfCards).toBe(0);
  });

  test("Two cards can be added to hand", () => {
    const deck = new Deck();
    const hand = new Hand();
    const openingHand = [deck.cards[0], deck.cards[1]];
    hand.receiveCards(openingHand);

    expect(openingHand).toEqual(hand.cards);
  });

  test("A card can be added to hand", () => {
    const deck = new Deck();
    const hand = new Hand();

    for (let i = 0; i < deck.numberOfCards; i++) {
      hand.receiveCards(deck.cards[i]);
      expect(deck.cards[i]).toBe(hand.cards[i]);
    }
  });

  test("The number of aces in hand should be counted correctly", () => {
    const aceCard = new Card("♣", "A");
    const cardArray = [
      new Card("♦", "K"),
      new Card("♣", "Q"),
      new Card("♥", "9"),
    ];
    const hand = new Hand([cardArray]);

    for (let i = 1; i <= 4; i++) {
      hand.cards.push(aceCard);
      expect(hand.getNumberOfAces()).toBe(i);
    }
  });
});

describe("Card", () => {
  test("A card object with suit and value can be created", () => {
    const card = new Card("♥", "A");
    expect(card.suit).toBe("♥");
    expect(card.value).toBe("A");
  });

  test.each([
    { suit: "♦", expected: "red" },
    { suit: "♣", expected: "black" },
    { suit: "♥", expected: "red" },
    { suit: "♠", expected: "black" },
  ])("$suit should be $expected", ({ suit, expected }) => {
    const card = new Card(suit, "3");
    expect(card.color).toBe(expected);
  });

  test("A card element should have classes of card and its color", () => {
    const cardArray = [
      new Card("♦", "2"),
      new Card("♣", "2"),
      new Card("♥", "2"),
      new Card("♠", "2"),
    ];
    for (const card of cardArray) {
      expect(card.getFrontHTML().className).toBe(`card ${card.color}`);
    }
  });
});
