import { useSerwist } from "virtual:serwist/solid";
import { createEffect, type Component } from "solid-js";
import styles from "./App.module.css";
import logo from "./logo.svg";

const App: Component = () => {
  const serwist = useSerwist();
  createEffect(() => {
    const swst = serwist();
    if (!swst) return;
    swst.addEventListener("installed", () => {
      console.log("Serwist installed!");
    });
    void swst.register();
  });
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a class={styles.link} href="https://github.com/solidjs/solid" target="_blank" rel="noopener noreferrer">
          Learn Solid
        </a>
      </header>
    </div>
  );
};

export default App;
