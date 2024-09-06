import { app, initModel } from "./app.js";

const rootNode = document.getElementById("app");
app(initModel, update, view, rootNode);
