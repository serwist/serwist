import { useEffect } from "react";
import { getSerwist } from "virtual:serwist";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const serwist = getSerwist();
      serwist?.addEventListener("installed", () => {
        console.log("Serwist installed!");
      });
      void serwist?.register();
    }
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
