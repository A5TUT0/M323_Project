import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

const { div, button, p, h1, h2 } = hh(h);

const MSGS = {
  ADD_CARD: "ADD_CARD",
  DELETE_CARD: "DELETE_CARD",
  SHOW_ANSWER: "SHOW_ANSWER",
  RATE_CARD: "RATE_CARD",
};

function calculateTotalScore(cards) {
  return cards.reduce((total, card) => total + card.rating, 0);
}

function viewCard(card, index, dispatch) {
  return div({ className: "p-4 bg-white shadow-md rounded-md flex justify-between items-center" }, [
    div({}, [
      h2({ className: "text-lg font-bold" }, `Question: ${card.question}`),
      card.showAnswer
        ? p({ className: "mt-2 text-gray-700" }, `Answer: ${card.answer}`)
        : button(
            {
              className: "mt-2 bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded",
              onclick: () => dispatch({ type: MSGS.SHOW_ANSWER, index }),
            },
            "Reveal Answer"
          ),
      card.showAnswer
        ? div({ className: "flex space-x-2 mt-4" }, [
            button(
              {
                className: "bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded",
                onclick: () => dispatch({ type: MSGS.RATE_CARD, index, rating: 0 }),
              },
              "Poor"
            ),
            button(
              {
                className: "bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded",
                onclick: () => dispatch({ type: MSGS.RATE_CARD, index, rating: 1 }),
              },
              "Good"
            ),
            button(
              {
                className: "bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded",
                onclick: () => dispatch({ type: MSGS.RATE_CARD, index, rating: 2 }),
              },
              "Excellent"
            ),
          ])
        : null,
      button(
        {
          className: "mt-4 bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded",
          onclick: () => dispatch({ type: MSGS.DELETE_CARD, index }),
        },
        "Remove Card"
      ),
    ]),
  ]);
}

function view(dispatch, model) {
  const totalScore = calculateTotalScore(model.cards);

  return div({ className: "space-y-4" }, [
    div({ className: "absolute top-4 right-4 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg shadow" }, [
      p({ className: "font-bold" }, `Total Score: ${totalScore}`),
    ]),
    button(
      {
        id: "create-card",
        className: "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded",
        onclick: () => {
          const question = prompt("Please enter the question:");
          const answer = prompt("Please enter the answer:");
          if (question && answer) {
            alert("Your new card has been successfully created!");
            dispatch({ type: MSGS.ADD_CARD, question, answer });
          } else {
            alert("Both question and answer are required to create a card.");
          }
        },
      },
      "Add New Card"
    ),
    ...model.cards.map((card, index) => viewCard(card, index, dispatch)),
  ]);
}

function update(msg, model) {
  switch (msg.type) {
    case MSGS.ADD_CARD:
      const newCard = { question: msg.question, answer: msg.answer, showAnswer: false, rating: 0 };
      return { ...model, cards: [...model.cards, newCard] };

    case MSGS.DELETE_CARD:
      const updatedCards = model.cards.filter((_, i) => i !== msg.index);
      return { ...model, cards: updatedCards };

    case MSGS.SHOW_ANSWER:
      const cardsWithAnswer = model.cards.map((card, i) => (i === msg.index ? { ...card, showAnswer: true } : card));
      return { ...model, cards: cardsWithAnswer };

    case MSGS.RATE_CARD:
      const ratedCards = model.cards.map((card, i) => (i === msg.index ? { ...card, rating: msg.rating } : card));
      return { ...model, cards: ratedCards };

    default:
      return model;
  }
}

function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);

  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

const initModel = {
  cards: [{ question: "What is JavaScript?", answer: "A programming language", showAnswer: false, rating: 0 }],
};

const rootNode = document.getElementById("cards-list");
app(initModel, update, view, rootNode);

module.exports = { calculateTotalScore, update, MSGS };
