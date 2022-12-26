import Deck from "./deck.js";

const CardOneSlot = document.querySelector(".card-one-slot");
const CardTwoSlot = document.querySelector(".card-two-slot");

const deck = new Deck();
deck.shuffle();
console.log(deck.cards);

CardOneSlot.appendChild(deck.cards[0].getHTML());
CardTwoSlot.appendChild(deck.cards[1].getHTML());
