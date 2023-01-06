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
    let hand = new Hand();

    expect(hand.numberOfCards).toBe(0);
  });

  test("A drawn card can be added to hand", () => {
    let hand = new Hand();
    let deck = new Deck();
    for (let i = 0; i < deck.numberOfCards; i++) {
      hand.draw(deck.cards[i]);
      expect(deck.cards[i]).toBe(hand.cards[i]);
    }
  });

  const aceCard = new Card("♣", "A");
  const kingCard = new Card("♣", "K");
  const queenCard = new Card("♣", "Q");
  const nineCard = new Card("♣", "9");

  test.each([
    { suit: "♦", value: "7", expected: 7 },
    { suit: "♣", value: "7", expected: 7 },
    { suit: "♥", value: "7", expected: 7 },
    { suit: "♠", value: "7", expected: 7 },
  ])(
    "The suit of the card should not affect value. $value should be evaluated as $expected when suit is $suit",
    ({ suit, value, expected }) => {
      const card = new Card(suit, value);
      const hand = new Hand([card]);
      expect(hand.evaluate()).toBe(expected);
    }
  );

  test.each([
    { suit: "♦", value: "2", expected: 2 },
    { suit: "♦", value: "3", expected: 3 },
    { suit: "♦", value: "4", expected: 4 },
    { suit: "♦", value: "5", expected: 5 },
    { suit: "♦", value: "6", expected: 6 },
    { suit: "♦", value: "7", expected: 7 },
    { suit: "♦", value: "8", expected: 8 },
    { suit: "♦", value: "9", expected: 9 },
    { suit: "♦", value: "10", expected: 10 },
  ])("$value should be worth $expected", ({ suit, value, expected }) => {
    const card = new Card(suit, value);
    const hand = new Hand([card]);
    expect(hand.evaluate()).toBe(expected);
  });

  test.each([
    { suit: "♣", value: "J", expected: 10 },
    { suit: "♣", value: "Q", expected: 10 },
    { suit: "♣", value: "K", expected: 10 },
  ])("$value should be worth $expected.", ({ suit, value, expected }) => {
    const card = new Card(suit, value);
    const hand = new Hand([card]);
    expect(hand.evaluate()).toBe(expected);
  });

  test("Given a king and an ace, score should be 21", () => {
    const hand = new Hand([kingCard, aceCard]);
    expect(hand.evaluate()).toBe(21);
  });

  test("Given a king, a queen, and an ace, score should be 21", () => {
    const hand = new Hand([kingCard, queenCard, aceCard]);
    expect(hand.evaluate()).toBe(21);
  });

  test("Given a nine, an ace, and another ace, score should be 21", () => {
    const hand = new Hand([nineCard, aceCard, aceCard]);
    expect(hand.evaluate()).toBe(21);
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
      expect(card.getHTML().className).toBe(`card ${card.color}`);
    }
  });
});
