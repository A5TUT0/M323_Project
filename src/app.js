import { calculateTotalScore, update } from "./model.js";
import { view } from "./view.js";
import { diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element.js";
import hh from "hyperscript-helpers";
import { h } from "virtual-dom";
const { div, p, input, button } = hh(h);

// source: Mr. Michel
function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = renderView(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);

  // Dispatch function to handle state changes and re-render the view.
  function dispatch(msg) {
    model = update(msg, model); // Update the state based on the dispatched message
    const updatedView = renderView(dispatch, model); // Re-render the updated view
    const patches = diff(currentView, updatedView); // Calculate the differences between the old and new views
    rootNode = patch(rootNode, patches); // Apply the changes to the real DOM
    currentView = updatedView; // Update the current view
  }

  // Function that renders the entire view, including the form and the list of cards.
  function renderView(dispatch, model) {
    const totalScore = calculateTotalScore(model.cards); // Calculate the total score of the cards
    return div({ className: "space-y-6" }, [
      // Display total score
      div({ className: "absolute top-4 right-4 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg shadow" }, [
        p({ className: "font-bold" }, `Total Score: ${totalScore}`),
      ]),
      renderForm(dispatch, model), // Render the form for adding/editing cards
      view(dispatch, model), // Render the list of cards
    ]);
  }
}

// Function to render the form for adding or editing a card.
function renderForm(dispatch, model) {
  const isEditing = model.editingCardIndex !== null; // Check if the user is editing an existing card
  return div({ className: "mb-4" }, [
    // Input for entering the question
    input({
      type: "text",
      placeholder: "Enter the question",
      className: "border p-2 rounded w-full mb-2",
      oninput: (e) => dispatch({ type: "UPDATE_NEW_CARD", field: "question", value: e.target.value }),
      value: model.newCard.question || "", // Set the input value from the model
    }),
    // Input for entering the answer
    input({
      type: "text",
      placeholder: "Enter the answer",
      className: "border p-2 rounded w-full mb-2",
      oninput: (e) => dispatch({ type: "UPDATE_NEW_CARD", field: "answer", value: e.target.value }),
      value: model.newCard.answer || "", // Set the input value from the model
    }),
    // Buttons for submitting or canceling the form
    div({ className: "flex space-x-4" }, [
      button(
        {
          className: "bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded",
          onclick: () => dispatch({ type: isEditing ? "UPDATE_CARD" : "ADD_CARD" }), // If editing, update the card; otherwise, add a new one
        },
        isEditing ? "Update" : "Done" // Button label changes based on the form mode (edit or add)
      ),
      button(
        {
          className: "bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded",
          onclick: () => dispatch({ type: "CANCEL_FORM" }), // Cancel the form and reset fields
        },
        "Cancel"
      ),
    ]),
  ]);
}

// Initial model for the app
const initModel = {
  cards: [], // No cards at the start
  newCard: { question: "", answer: "" }, // Empty card for new inputs
  editingCardIndex: null, // No card is being edited initially
};

// Export the app and initial model
export { app, initModel };
