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
    const oldDeckCard = deck.cards[34];
    deck.shuffle();
    const shuffledDeckCard = deck.cards[34];
    expect(oldDeckCard).not.toEqual(shuffledDeckCard);
  });
});

describe("Hand", () => {
  let hand;

  beforeEach(() => {
    hand = new Hand();
  });

  test("The number of cards in one hand before dealing cards should be 0", () => {
    expect(hand.numberOfCards).toBe(0);
  });

  test("A drawn card can be added to hand", () => {
    const nineCard = new Card("♣", "9");
    hand.draw(nineCard);
    expect(hand.cards[hand.numberOfCards - 1]).toBe(nineCard);
  });
});

describe("Card", () => {
  test("A card object with suit and value can be created", () => {
    const card = new Card("♥", "A");
    expect(card).toEqual({ suit: "♥", value: "A" });
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
    const card = new Card("♦", "2");
    const cardElement = card.getHTML();
    expect(cardElement.className).toEqual("card red");
  });
});
