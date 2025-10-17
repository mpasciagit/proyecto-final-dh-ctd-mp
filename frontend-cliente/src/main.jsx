import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import createMockReservations from "./utils/mockData";

// Crear datos de prueba en desarrollo
if (import.meta.env.DEV) {
  createMockReservations();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
