import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

const root = document.getElementById("root");

if (!root) throw new Error("Failed to find root.");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
