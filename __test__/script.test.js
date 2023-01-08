import { evaluateDealerHand } from "../scripts/script";
import { Hand, Card } from "../scripts/deck";

/**
 * @jest-environment jsdom
 */

describe("Evaluate Dealer Hand", () => {
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
      expect(evaluateDealerHand(hand)).toBe(expected);
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
    expect(evaluateDealerHand(hand)).toBe(expected);
  });

  test.each([
    { suit: "♣", value: "J", expected: 10 },
    { suit: "♣", value: "Q", expected: 10 },
    { suit: "♣", value: "K", expected: 10 },
  ])("$value should be worth $expected.", ({ suit, value, expected }) => {
    const card = new Card(suit, value);
    const hand = new Hand([card]);
    expect(evaluateDealerHand(hand)).toBe(expected);
  });

  test("Given a king and an ace, score should be 21", () => {
    const hand = new Hand([kingCard, aceCard]);
    expect(evaluateDealerHand(hand)).toBe(21);
  });

  test("Given a king, a queen, and an ace, score should be 21", () => {
    const hand = new Hand([kingCard, queenCard, aceCard]);
    expect(evaluateDealerHand(hand)).toBe(21);
  });

  test("Given a nine, an ace, and another ace, score should be 21", () => {
    const hand = new Hand([nineCard, aceCard, aceCard]);
    expect(evaluateDealerHand(hand)).toBe(21);
  });
});
