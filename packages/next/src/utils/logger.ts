// eslint-disable-next-line import/no-extraneous-dependencies
import chalk from "chalk";
import { coerce as semverCoerce, lt as semverLt } from "semver";

import { getPackageVersion } from "./get-package-version.js";

const nextPackageJson = semverCoerce(getPackageVersion("next"));
const isNextOlderThan13_4_1 =
    !!nextPackageJson && semverLt(nextPackageJson, "13.4.1"),
  isNextOlderThan13_4_20 =
    !!nextPackageJson && semverLt(nextPackageJson, "13.4.20");

const LOGGING_METHOD = ["wait", "error", "warn", "info", "event"] as const;

type LoggingMethods = (typeof LOGGING_METHOD)[number];

type Prefixes = Record<LoggingMethods, string>;

const mapLoggingMethodToConsole: Record<
  LoggingMethods,
  "log" | "error" | "warn" | "log"
> = {
  wait: "log",
  error: "error",
  warn: "warn",
  info: "log",
  event: "log",
};

/**
 * Get logging prefixes.
 * @returns
 */
const getPrefixes = (): Prefixes => {
  if (isNextOlderThan13_4_1) {
    return {
      wait: `${chalk.cyan("wait")}  - (PWA)`,
      error: `${chalk.red("error")} - (PWA)`,
      warn: `${chalk.yellow("warn")}  - (PWA)`,
      info: `${chalk.cyan("info")}  - (PWA)`,
      event: `${chalk.cyan("info")}  - (PWA)`,
    };
  }
  if (isNextOlderThan13_4_20) {
    return {
      wait: `- ${chalk.cyan("wait")} (pwa)`,
      error: `- ${chalk.red("error")} (pwa)`,
      warn: `- ${chalk.yellow("warn")} (pwa)`,
      info: `- ${chalk.cyan("info")} (pwa)`,
      event: `- ${chalk.cyan("info")} (pwa)`,
    };
  }
  return {
    wait: `${chalk.white(chalk.bold("○"))} (pwa)`,
    error: `${chalk.red(chalk.bold("X"))} (pwa)`,
    warn: `${chalk.yellow(chalk.bold("⚠"))} (pwa)`,
    info: `${chalk.white(chalk.bold("○"))} (pwa)`,
    event: `${chalk.green(chalk.bold("✓"))} (pwa)`,
  };
};

const prefixes = getPrefixes();

const prefixedLog = (prefixType: LoggingMethods, ...message: any[]) => {
  const consoleMethod = mapLoggingMethodToConsole[prefixType];
  const prefix = prefixes[prefixType];

  if (isNextOlderThan13_4_20) {
    return console[consoleMethod](prefix, ...message);
  }

  if ((message[0] === "" || message[0] === undefined) && message.length === 1) {
    message.shift();
  }

  // If there's no message, don't print the prefix but a new line
  if (message.length === 0) {
    console[consoleMethod]("");
  } else {
    console[consoleMethod](" " + prefix, ...message);
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
