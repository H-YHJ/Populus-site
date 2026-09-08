import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import '@fontsource/noto-serif-sc/500.css';
import '@fontsource/noto-sans-sc/400.css';
import "./site.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
