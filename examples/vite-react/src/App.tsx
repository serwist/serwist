import "./App.css";

import { getSerwist } from "@serwist/vite/browser";
import { useEffect } from "react";

import viteLogo from "/vite.svg";

import reactLogo from "./assets/react.svg";

function App() {
  useEffect(() => {
    const registerSerwist = async () => {
      // dev is not supported yet.
      if (import.meta.env.DEV) return;
      const serwist = await getSerwist();
      if (serwist) {
        serwist.addEventListener("installed", () => console.log("Serwist installed!"));
        await serwist.register();
      }
    };
    registerSerwist();
  });

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Serwist</h1>
    </>
  );
}

export default App;
