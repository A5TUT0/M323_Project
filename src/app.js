import { update, MSGS } from "./model.js";
import { view } from "./view.js";
import createElement from "virtual-dom/create-element.js";
import { diff, patch } from "virtual-dom";

// Source: Herr. Michel
export function app(initModel, update, view, node) {
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

// Initial model with an example card and an empty form
export const initModel = {
  cards: [{ question: "What is JavaScript?", answer: "A programming language", showAnswer: false, rating: 0 }],
  newCard: { question: "", answer: "" },
  editingCardIndex: null, // Stores the index of the card being edited
};
