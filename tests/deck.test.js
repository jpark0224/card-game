import Deck from "../deck";

describe("deck", () => {
  const deck = new Deck();
  test("the number of cards in one deck is 52", () => {
    expect(deck.numberOfCards).toBe(52);
  });
});
