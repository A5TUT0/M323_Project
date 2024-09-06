// Import the necessary functions and model for the app
import { app, initModel } from "./app.js";
import { update } from "./model.js";
import { view } from "./view.js";

// Get the root DOM node where the app will be mounted
const rootNode = document.getElementById("app");

// Initialize and start the app
app(initModel, update, view, rootNode);
