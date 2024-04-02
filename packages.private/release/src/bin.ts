#!/usr/bin/env node
import { app } from "./app.js";

void (async () => {
  try {
    await app();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`\n${error.message}\n${error.stack ?? ""}`);
    }
    process.exit(1);
  }
})();
