import { bold, green, red, white, yellow } from "kolorist";
import nextPackageJson from "next/package.json" with { type: "json" };
import semver from "semver";

const LOGGING_METHOD = ["wait", "error", "warn", "info", "event"] as const;

const LOGGING_SPACE_PREFIX = semver.gte(nextPackageJson.version, "16.0.0") ? "" : " ";

type LoggingMethods = (typeof LOGGING_METHOD)[number];

const mapLoggingMethodToConsole: Record<LoggingMethods, "log" | "error" | "warn" | "log"> = {
  wait: "log",
  error: "error",
  warn: "warn",
  info: "log",
  event: "log",
};

const prefixes = {
  wait: `${white(bold("○"))} (serwist)`,
  error: `${red(bold("X"))} (serwist)`,
  warn: `${yellow(bold("⚠"))} (serwist)`,
  info: `${white(bold("○"))} (serwist)`,
  event: `${green(bold("✓"))} (serwist)`,
};

const prefixedLog = (prefixType: LoggingMethods, ...message: any[]) => {
  const consoleMethod = mapLoggingMethodToConsole[prefixType];
  const prefix = prefixes[prefixType];

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

export const wait = (...message: any[]) => {
  prefixedLog("wait", ...message);
};

export const error = (...message: any[]) => {
  prefixedLog("error", ...message);
};

export const warn = (...message: any[]) => {
  prefixedLog("warn", ...message);
};

export const info = (...message: any[]) => {
  prefixedLog("info", ...message);
};

export const event = (...message: any[]) => {
  prefixedLog("event", ...message);
};
