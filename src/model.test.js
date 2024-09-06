const { calculateTotalScore, update, MSGS } = require("./model");

describe("Model tests", () => {
  test("should calculate total score", () => {
    const cards = [{ rating: 2 }, { rating: 1 }, { rating: 0 }];

    const result = calculateTotalScore(cards);

    expect(result).toBe(3);
  });

  test("should add a card", () => {
    const initModel = {
      cards: [],
      newCard: { question: "What is JavaScript?", answer: "A programming language" },
    };

    const msg = { type: MSGS.ADD_CARD };
    const updatedModel = update(msg, initModel);

    expect(updatedModel.cards.length).toBe(1);
    expect(updatedModel.cards[0].question).toBe("What is JavaScript?");
    expect(updatedModel.cards[0].answer).toBe("A programming language");
  });

  test("should delete a card", () => {
    const initModel = {
      cards: [
        { question: "What is JavaScript?", answer: "A programming language" },
        { question: "What is HTML?", answer: "A markup language" },
      ],
    };

    const msg = { type: MSGS.DELETE_CARD, index: 0 };
    const updatedModel = update(msg, initModel);

    expect(updatedModel.cards.length).toBe(1);
    expect(updatedModel.cards[0].question).toBe("What is HTML?");
  });

  test("should update form input", () => {
    const initModel = {
      newCard: { question: "", answer: "" },
    };

    const msg = { type: MSGS.UPDATE_NEW_CARD, field: "question", value: "What is CSS?" };
    const updatedModel = update(msg, initModel);

    expect(updatedModel.newCard.question).toBe("What is CSS?");
  });

  test("should reset form on cancel", () => {
    const initModel = {
      newCard: { question: "What is CSS?", answer: "A style sheet language" },
      editingCardIndex: 1,
    };

    const msg = { type: MSGS.CANCEL_FORM };
    const updatedModel = update(msg, initModel);

    expect(updatedModel.newCard.question).toBe("");
    expect(updatedModel.newCard.answer).toBe("");
    expect(updatedModel.editingCardIndex).toBeNull();
  });

  test("should show the answer", () => {
    const initModel = {
      cards: [{ question: "What is JavaScript?", answer: "A programming language", showAnswer: false }],
    };

    const msg = { type: MSGS.SHOW_ANSWER, index: 0 };
    const updatedModel = update(msg, initModel);

    expect(updatedModel.cards[0].showAnswer).toBe(true);
  });

  test("should rate a card", () => {
    const initModel = {
      cards: [{ question: "What is JavaScript?", answer: "A programming language", rating: 0 }],
    };

    const msg = { type: MSGS.RATE_CARD, index: 0, rating: 2 };
    const updatedModel = update(msg, initModel);

    expect(updatedModel.cards[0].rating).toBe(2);
  });
});
