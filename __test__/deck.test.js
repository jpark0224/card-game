import { Deck, Hand } from "../scripts/deck";

describe("deck", () => {
  const deck = new Deck();

  test("the number of cards in one deck should be 52", () => {
    expect(deck.numberOfCards).toBe(52);
  });
});

describe("hand", () => {
  const hand = new Hand();
  test("the number of cards in one hand before dealing cards should be 0", () => {
    expect(hand.numberOfCards).toBe(0);
  });
});
