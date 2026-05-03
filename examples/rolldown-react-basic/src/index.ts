import { Serwist } from "@serwist/window";

console.log("hello world!");

const serwist = new Serwist("/sw.js");

void serwist.register().then(() => {
  console.log("Service worker registered!");
});
