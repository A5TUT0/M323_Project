// Messages that define the different actions the app can take
const MSGS = {
  ADD_CARD: "ADD_CARD",
  DELETE_CARD: "DELETE_CARD",
  SHOW_ANSWER: "SHOW_ANSWER",
  RATE_CARD: "RATE_CARD",
  UPDATE_NEW_CARD: "UPDATE_NEW_CARD",
  CANCEL_FORM: "CANCEL_FORM",
  EDIT_CARD: "EDIT_CARD",
  UPDATE_CARD: "UPDATE_CARD",
};

// Function to calculate the total score by summing up the ratings of all cards
function calculateTotalScore(cards) {
  return cards.reduce((total, card) => total + card.rating, 0);
}

// source: With AI assistance
function update(msg, model) {
  switch (msg.type) {
    case MSGS.UPDATE_NEW_CARD: // Update the question or answer fields in the form
      return {
        ...model,
        newCard: {
          ...model.newCard,
          [msg.field]: msg.value, // Update the field (either question or answer) with the new value
        },
      };
    case MSGS.ADD_CARD: // Add a new card to the list
      if (model.newCard.question && model.newCard.answer) {
        const newCard = { ...model.newCard, showAnswer: false, rating: 0 }; // Create a new card object
        return { ...model, cards: [...model.cards, newCard], newCard: { question: "", answer: "" } }; // Add the card and reset the form
      }
      return model;
    case MSGS.CANCEL_FORM: // Cancel the form and reset the input fields
      return {
        ...model,
        newCard: { question: "", answer: "" },
        editingCardIndex: null,
      };
    case MSGS.DELETE_CARD: // Delete a card by index
      return {
        ...model,
        cards: model.cards.filter((_, i) => i !== msg.index), // Remove the card at the specified index
      };
    case MSGS.SHOW_ANSWER: // Toggle the visibility of the answer for a card
      return {
        ...model,
        cards: model.cards.map(
          (card, i) => (i === msg.index ? { ...card, showAnswer: !card.showAnswer } : card) // Toggle showAnswer state for the selected card
        ),
      };
    case MSGS.RATE_CARD: // Rate a card (0 = Poor, 1 = Good, 2 = Excellent)
      return {
        ...model,
        cards: model.cards.map((card, i) => (i === msg.index ? { ...card, rating: msg.rating } : card)), // Update the rating of the selected card
      };
    case MSGS.EDIT_CARD: // Edit a card, pre-fill the form with its details
      const cardToEdit = model.cards[msg.index];
      return {
        ...model,
        newCard: { question: cardToEdit.question, answer: cardToEdit.answer }, // Fill the form with the selected card's data
        editingCardIndex: msg.index,
      };
    case MSGS.UPDATE_CARD: // Update an existing card with new data
      if (model.newCard.question && model.newCard.answer) {
        const updatedCard = { ...model.newCard, showAnswer: false, rating: model.cards[model.editingCardIndex].rating };
        const updatedCards = model.cards.map((card, i) => (i === model.editingCardIndex ? updatedCard : card)); // Replace the card being edited
        return {
          ...model,
          cards: updatedCards,
          newCard: { question: "", answer: "" }, // Reset the form
          editingCardIndex: null,
        };
      }
      return model;
    default:
      return model;
  }
}

// Export the necessary functions and constants
export { calculateTotalScore, update, MSGS };
