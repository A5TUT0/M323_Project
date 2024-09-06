import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element.js";

const { div, button, p, h2, input } = hh(h);

// Definición de los diferentes mensajes que pueden desencadenar acciones
const MSGS = {
  ADD_CARD: "ADD_CARD", // Añadir nueva tarjeta
  DELETE_CARD: "DELETE_CARD", // Eliminar tarjeta
  SHOW_ANSWER: "SHOW_ANSWER", // Mostrar la respuesta de la tarjeta
  RATE_CARD: "RATE_CARD", // Calificar la tarjeta
  UPDATE_NEW_CARD: "UPDATE_NEW_CARD", // Actualizar el contenido del formulario
  CANCEL_FORM: "CANCEL_FORM", // Cancelar el formulario de entrada
};

// Calcula la puntuación total sumando las calificaciones de todas las tarjetas
function calculateTotalScore(cards) {
  return cards.reduce((total, card) => total + card.rating, 0);
}

// Genera la vista de una tarjeta individual, mostrando la pregunta, la opción de mostrar la respuesta y los botones de calificación
function viewCard(card, index, dispatch) {
  return div(
    {
      className: "p-6 bg-yellow-100 shadow-lg rounded-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out",
    },
    [
      div({}, [
        h2({ className: "text-xl font-bold text-gray-800 mb-4" }, `Question: ${card.question}`),

        // Si la respuesta está visible, la muestra, si no, muestra el botón para revelar la respuesta
        card.showAnswer
          ? p({ className: "mt-2 text-gray-700" }, `Answer: ${card.answer}`)
          : button(
              {
                className: "mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg",
                onclick: () => dispatch({ type: MSGS.SHOW_ANSWER, index }),
              },
              "Reveal Answer"
            ),

        // Si la respuesta está visible, muestra los botones para calificar la tarjeta
        card.showAnswer
          ? div({ className: "flex space-x-4 mt-6" }, [
              button(
                {
                  className: "bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-bold",
                  onclick: () => dispatch({ type: MSGS.RATE_CARD, index, rating: 0 }),
                },
                "Poor"
              ),
              button(
                {
                  className: "bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-bold",
                  onclick: () => dispatch({ type: MSGS.RATE_CARD, index, rating: 1 }),
                },
                "Good"
              ),
              button(
                {
                  className: "bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-bold",
                  onclick: () => dispatch({ type: MSGS.RATE_CARD, index, rating: 2 }),
                },
                "Excellent"
              ),
            ])
          : null,

        // Botón para eliminar la tarjeta
        button(
          {
            className: "mt-6 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-bold",
            onclick: () => dispatch({ type: MSGS.DELETE_CARD, index }),
          },
          "Remove Card"
        ),
      ]),
    ]
  );
}

// Genera la vista principal de la aplicación
function view(dispatch, model) {
  const totalScore = calculateTotalScore(model.cards); // Calcula la puntuación total

  // Codigo hecho por IA
  const sortedCards = model.cards.slice().sort((a, b) => b.rating - a.rating);

  // Renderiza la vista principal, incluyendo el formulario y las tarjetas ordenadas
  return div({ className: "space-y-6" }, [
    div({ className: "absolute top-4 right-4 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg shadow" }, [
      p({ className: "font-bold" }, `Total Score: ${totalScore}`), // Muestra la puntuación total
    ]),
    // Codigo hecho por IA
    renderForm(dispatch, model), // Renderiza el formulario para agregar nuevas tarjetas
    ...sortedCards.map((card, index) => viewCard(card, index, dispatch)), // Renderiza las tarjetas ordenadas
  ]);
}

// Genera el formulario para agregar nuevas tarjetas con campos para la pregunta y la respuesta
function renderForm(dispatch, model) {
  return div({ className: "mb-4" }, [
    // I
    input({
      type: "text",
      placeholder: "Enter the question",
      className: "border p-2 rounded w-full mb-2",
      oninput: (e) => dispatch({ type: MSGS.UPDATE_NEW_CARD, field: "question", value: e.target.value }),
      value: model.newCard.question || "", // Mantiene el valor del campo sincronizado con el modelo
    }),
    // Input para la respuesta
    input({
      type: "text",
      placeholder: "Enter the answer",
      className: "border p-2 rounded w-full mb-2",
      oninput: (e) => dispatch({ type: MSGS.UPDATE_NEW_CARD, field: "answer", value: e.target.value }),
      value: model.newCard.answer || "",
    }),
    // Botones para agregar la tarjeta o cancelar el formulario
    div({ className: "flex space-x-4" }, [
      button(
        {
          className: "bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded",
          onclick: () => dispatch({ type: MSGS.ADD_CARD }), // Agregar la nueva tarjeta
        },
        "Done"
      ),
      button(
        {
          className: "bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded",
          onclick: () => dispatch({ type: MSGS.CANCEL_FORM }), // Cancelar el formulario
        },
        "Cancel"
      ),
    ]),
  ]);
}

// Función que actualiza el estado del modelo basado en el mensaje recibido
function update(msg, model) {
  switch (msg.type) {
    case MSGS.UPDATE_NEW_CARD:
      // Actualiza el contenido de la nueva tarjeta
      return {
        ...model,
        newCard: {
          ...model.newCard,
          [msg.field]: msg.value,
        },
      };

    case MSGS.ADD_CARD:
      // Añade la nueva tarjeta al modelo si tiene pregunta y respuesta
      if (model.newCard.question && model.newCard.answer) {
        const newCard = { ...model.newCard, showAnswer: false, rating: 0 }; // Añade con un rating inicial de 0
        return { ...model, cards: [...model.cards, newCard], newCard: { question: "", answer: "" } }; // Limpia el formulario después de añadir
      }
      return model;

    case MSGS.CANCEL_FORM:
      // Limpia los campos del formulario
      return {
        ...model,
        newCard: { question: "", answer: "" },
      };

    case MSGS.DELETE_CARD:
      // Elimina la tarjeta seleccionada
      const updatedCards = model.cards.filter((_, i) => i !== msg.index);
      return { ...model, cards: updatedCards };

    case MSGS.SHOW_ANSWER:
      // Muestra la respuesta de la tarjeta seleccionada
      const cardsWithAnswer = model.cards.map((card, i) => (i === msg.index ? { ...card, showAnswer: true } : card));
      return { ...model, cards: cardsWithAnswer };

    case MSGS.RATE_CARD:
      // Actualiza el rating de la tarjeta seleccionada
      const ratedCards = model.cards.map((card, i) => (i === msg.index ? { ...card, rating: msg.rating } : card));
      return { ...model, cards: ratedCards };

    default:
      return model;
  }
}
// Quelle: Herr. Michel
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

// Modelo inicial con una tarjeta de ejemplo y un formulario vacío
const initModel = {
  cards: [{ question: "What is JavaScript?", answer: "A programming language", showAnswer: false, rating: 0 }],
  newCard: { question: "", answer: "" },
};

const rootNode = document.getElementById("app");
app(initModel, update, view, rootNode);
