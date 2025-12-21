import { swScope, swType, swUrl } from "virtual:serwist";
import { Serwist } from "@serwist/window";

const serwist = new Serwist(swUrl, { scope: swScope, type: swType });

serwist.addEventListener("installed", () => {
  console.log("Serwist installed!");
});

void serwist.register();
