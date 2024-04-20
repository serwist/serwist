import "./App.css";

import { swUrl, swScope, swType } from "virtual:serwist";
import { useEffect } from "react";

import viteLogo from "/vite.svg";

import reactLogo from "./assets/react.svg";

function App() {
  useEffect(() => {
    const loadSerwist = async () => {
      if ("serviceWorker" in navigator) {
        const serwist = new (await import("@serwist/window")).Serwist(swUrl, { scope: swScope, type: swType });
        serwist.addEventListener("installed", () => console.log("Serwist installed!"));
        void serwist.register();
      }
    };
    loadSerwist();
  });

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Serwist</h1>
    </>
  );
}

export default App;
