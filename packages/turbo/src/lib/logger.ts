import { createRequire } from "node:module";
import { bold, green, red, white, yellow } from "kolorist";
import semver from "semver";

const require = createRequire(import.meta.url);

export const NEXT_VERSION = require("next/package.json").version as string;

const LOGGING_SPACE_PREFIX = semver.gte(NEXT_VERSION, "16.0.0") ? "" : " ";

export type LoggingMethods = "wait" | "error" | "warn" | "info" | "event";

const prefixedLog = (prefixType: LoggingMethods, ...message: any[]) => {
  let prefix: string;
  let consoleMethod: keyof Console;

  switch (prefixType) {
    case "wait":
      prefix = `${white(bold("○"))} (serwist)`;
      consoleMethod = "log";
      break;
    case "error":
      prefix = `${red(bold("X"))} (serwist)`;
      consoleMethod = "error";
      break;
    case "warn":
      prefix = `${yellow(bold("⚠"))} (serwist)`;
      consoleMethod = "warn";
      break;
    case "info":
      prefix = `${white(bold("○"))} (serwist)`;
      consoleMethod = "log";
      break;
    case "event":
      prefix = `${green(bold("✓"))} (serwist)`;
      consoleMethod = "log";
      break;
  }

  if ((message[0] === "" || message[0] === undefined) && message.length === 1) {
    message.shift();
  }

  // If there's no message, don't print the prefix but a new line
  if (message.length === 0) {
    console[consoleMethod]("");
  } else {
    console[consoleMethod](`${LOGGING_SPACE_PREFIX}${prefix}`, ...message);
  }
};

export const wait = (...message: any[]) => prefixedLog("wait", ...message);

export const error = (...message: any[]) => prefixedLog("error", ...message);

export const warn = (...message: any[]) => prefixedLog("warn", ...message);

export const info = (...message: any[]) => prefixedLog("info", ...message);

export const event = (...message: any[]) => prefixedLog("event", ...message);
