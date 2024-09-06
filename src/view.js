import hh from "hyperscript-helpers";
import { h } from "virtual-dom";
const { div, button, p, h2 } = hh(h);

// source: With AI assistance
function viewCard(card, index, dispatch) {
  return div(
    {
      className: "p-6 bg-yellow-100 shadow-lg rounded-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out",
    },
    [
      // Card content: question and answer (if revealed)
      div({}, [
        h2({ className: "text-xl font-bold text-gray-800 mb-4" }, `Question: ${card.question}`),
        card.showAnswer
          ? p({ className: "mt-2 text-gray-700" }, `Answer: ${card.answer}`)
          : button(
              {
                className: "mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg",
                onclick: () => dispatch({ type: "SHOW_ANSWER", index }), // Toggle answer visibility
              },
              "Reveal Answer"
            ),
        // Rating buttons (only visible if the answer is shown)
        card.showAnswer
          ? div({ className: "flex space-x-4 mt-6" }, [
              button(
                {
                  className: "bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-bold",
                  onclick: () => dispatch({ type: "RATE_CARD", index, rating: 0 }), // Rate as Poor
                },
                "Poor"
              ),
              button(
                {
                  className: "bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-bold",
                  onclick: () => dispatch({ type: "RATE_CARD", index, rating: 1 }), // Rate as Good
                },
                "Good"
              ),
              button(
                {
                  className: "bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-bold",
                  onclick: () => dispatch({ type: "RATE_CARD", index, rating: 2 }), // Rate as Excellent
                },
                "Excellent"
              ),
            ])
          : null,
        // Edit and Delete buttons for each card
        button(
          {
            className: "mt-2 bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-bold",
            onclick: () => dispatch({ type: "EDIT_CARD", index }), // Trigger edit mode for this card
          },
          "📝Edit"
        ),
        button(
          {
            className: "mt-6 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-bold",
            onclick: () => dispatch({ type: "DELETE_CARD", index }), // Delete the card
          },
          "Remove Card"
        ),
      ]),
    ]
  );
}

// Function to render the view containing the cards
function view(dispatch, model) {
  const sortedCards = model.cards.slice().sort((a, b) => b.rating - a.rating); // Sort cards by rating

  // Render each card
  return div({ className: "space-y-6" }, [...sortedCards.map((card, index) => viewCard(card, index, dispatch))]);
}

// Export the functions
export { view, viewCard };
