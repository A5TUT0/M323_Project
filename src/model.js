// Definition of the different messages that can trigger actions
const MSGS = {
  ADD_CARD: "ADD_CARD", // Add new card
  DELETE_CARD: "DELETE_CARD", // Delete card
  SHOW_ANSWER: "SHOW_ANSWER", // Show the card's answer
  RATE_CARD: "RATE_CARD", // Rate the card
  UPDATE_NEW_CARD: "UPDATE_NEW_CARD", // Update form input
  CANCEL_FORM: "CANCEL_FORM", // Cancel form input
  EDIT_CARD: "EDIT_CARD", // Edit an existing card
  UPDATE_CARD: "UPDATE_CARD", // Save changes to an edited card
};

// Calculates the total score by summing up all card ratings
function calculateTotalScore(cards) {
  return cards.reduce((total, card) => total + card.rating, 0);
}

// source: With the help of IA
function update(msg, model) {
  switch (msg.type) {
    case MSGS.UPDATE_NEW_CARD:
      // Update the form input content
      return {
        ...model,
        newCard: {
          ...model.newCard,
          [msg.field]: msg.value,
        },
      };

    case MSGS.ADD_CARD:
      // Add the new card to the model if it has both a question and an answer
      if (model.newCard.question && model.newCard.answer) {
        const newCard = { ...model.newCard, showAnswer: false, rating: 0 }; // Add the card with an initial rating of 0
        return { ...model, cards: [...model.cards, newCard], newCard: { question: "", answer: "" } }; // Clear the form after adding
      }
      return model;

    case MSGS.CANCEL_FORM:
      // Clear the form fields
      return {
        ...model,
        newCard: { question: "", answer: "" },
        editingCardIndex: null, // Reset the editing index
      };

    case MSGS.DELETE_CARD:
      // Delete the selected card
      return {
        ...model,
        cards: model.cards.filter((_, i) => i !== msg.index),
      };

    case MSGS.SHOW_ANSWER:
      // Show the answer for the selected card
      return {
        ...model,
        cards: model.cards.map((card, i) => (i === msg.index ? { ...card, showAnswer: true } : card)),
      };

    case MSGS.RATE_CARD:
      // Update the rating for the selected card
      return {
        ...model,
        cards: model.cards.map((card, i) => (i === msg.index ? { ...card, rating: msg.rating } : card)),
      };

    case MSGS.EDIT_CARD:
      // Load the data from the card to edit into the form
      const cardToEdit = model.cards[msg.index];
      return {
        ...model,
        newCard: { question: cardToEdit.question, answer: cardToEdit.answer },
        editingCardIndex: msg.index, // Store the index of the card being edited
      };

    case MSGS.UPDATE_CARD:
      // Save the changes to the edited card
      if (model.newCard.question && model.newCard.answer) {
        const updatedCard = { ...model.newCard, showAnswer: false, rating: model.cards[model.editingCardIndex].rating };
        const updatedCards = model.cards.map((card, i) => (i === model.editingCardIndex ? updatedCard : card));
        return {
          ...model,
          cards: updatedCards, // Update the card in the state
          newCard: { question: "", answer: "" }, // Clear the form
          editingCardIndex: null, // Reset the editing index
        };
      }
      return model;

    default:
      return model;
  }
}
module.exports = { calculateTotalScore, update, MSGS };
