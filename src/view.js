import hh from "hyperscript-helpers";
import { h } from "virtual-dom";
import { calculateTotalScore } from "./model.js";

const { div, button, p, h2, input } = hh(h);

// Generates the view of an individual card, displaying the question, the option to show the answer, and the rating buttons
export function viewCard(card, index, dispatch) {
  return div(
    {
      className: "p-6 bg-yellow-100 shadow-lg rounded-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out",
    },
    [
      div({}, [
        h2({ className: "text-xl font-bold text-gray-800 mb-4" }, `Question: ${card.question}`),

        // If the answer is visible, display it, otherwise, show the button to reveal the answer
        card.showAnswer
          ? p({ className: "mt-2 text-gray-700" }, `Answer: ${card.answer}`)
          : button(
              {
                className: "mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg",
                onclick: () => dispatch({ type: "SHOW_ANSWER", index }),
              },
              "Reveal Answer"
            ),

        // If the answer is visible, show the rating buttons
        card.showAnswer
          ? div({ className: "flex space-x-4 mt-6" }, [
              button(
                {
                  className: "bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-bold",
                  onclick: () => dispatch({ type: "RATE_CARD", index, rating: 0 }),
                },
                "Poor"
              ),
              button(
                {
                  className: "bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-bold",
                  onclick: () => dispatch({ type: "RATE_CARD", index, rating: 1 }),
                },
                "Good"
              ),
              button(
                {
                  className: "bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-bold",
                  onclick: () => dispatch({ type: "RATE_CARD", index, rating: 2 }),
                },
                "Excellent"
              ),
            ])
          : null,

        // Button to edit the card
        button(
          {
            className: "mt-2 bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-bold",
            onclick: () => dispatch({ type: "EDIT_CARD", index }), // Triggers the message to edit a card
          },
          "📝Edit"
        ),

        // Button to delete the card
        button(
          {
            className: "mt-6 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-bold",
            onclick: () => dispatch({ type: "DELETE_CARD", index }), // Triggers the message to delete a card
          },
          "Remove Card"
        ),
      ]),
    ]
  );
}

// source: With the help of IA
export function view(dispatch, model) {
  const totalScore = calculateTotalScore(model.cards); // Calculate total score

  // Sorts the cards by their rating from highest to lowest
  const sortedCards = model.cards.slice().sort((a, b) => b.rating - a.rating);

  // Renders the main view, including the form and the sorted cards
  return div({ className: "space-y-6" }, [
    div({ className: "absolute top-4 right-4 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg shadow" }, [
      p({ className: "font-bold" }, `Total Score: ${totalScore}`), // Display total score
    ]),
    renderForm(dispatch, model), // Render the form to add new cards
    ...sortedCards.map((card, index) => viewCard(card, index, dispatch)), // Render the sorted cards
  ]);
}

// Generates the form to add new cards with fields for the question and the answer
export function renderForm(dispatch, model) {
  const isEditing = model.editingCardIndex !== null; // Check if we are editing a card
  return div({ className: "mb-4" }, [
    // Input for the question
    input({
      type: "text",
      placeholder: "Enter the question",
      className: "border p-2 rounded w-full mb-2",
      oninput: (e) => dispatch({ type: "UPDATE_NEW_CARD", field: "question", value: e.target.value }),
      value: model.newCard.question || "", // Keep the input value synced with the model
    }),
    // Input for the answer
    input({
      type: "text",
      placeholder: "Enter the answer",
      className: "border p-2 rounded w-full mb-2",
      oninput: (e) => dispatch({ type: "UPDATE_NEW_CARD", field: "answer", value: e.target.value }),
      value: model.newCard.answer || "",
    }),
    // Buttons to add the card or cancel the form
    div({ className: "flex space-x-4" }, [
      button(
        {
          className: "bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded",
          onclick: () => dispatch({ type: isEditing ? "UPDATE_CARD" : "ADD_CARD" }), // Switch between adding or updating
        },
        isEditing ? "Update" : "Done" // Button text changes depending on whether we are editing or adding
      ),
      button(
        {
          className: "bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded",
          onclick: () => dispatch({ type: "CANCEL_FORM" }), // Cancel the form
        },
        "Cancel"
      ),
    ]),
  ]);
}
