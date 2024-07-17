import "./App.css";
import { Serwist } from "@serwist/window";
import { useEffect } from "react";
import reactLogo from "./assets/react.svg";
import rspackLogo from "./assets/rspack.svg";

function App() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const serwist = new Serwist("/sw.js");
      serwist?.addEventListener("installed", () => {
        console.log("Serwist installed!");
      });
      void serwist?.register();
    }
  });

  return (
    <>
      <div>
        <a href="https://www.rsbuild.dev" target="_blank" rel="noreferrer">
          <img src={rspackLogo} className="logo" alt="Rsbuild's logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React's logo" />
        </a>
      </div>
      <h1>Rspack + React + Serwist</h1>
    </>
  );
}

export default App;
