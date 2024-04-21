import { Serwist } from "@serwist/window";

if ("serviceWorker" in navigator) {
  const serwist = new Serwist("./sw.js");

  serwist.addEventListener("activated", () => {
    console.log("Serwist activated!");
  });

  void serwist.register();
}

let count = 0;
const counterButton = document.getElementById("button");

if (counterButton) {
  counterButton.addEventListener("click", () => {
    count++;
    counterButton.innerText = `${count}`;
  });
}
