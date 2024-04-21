import chalk from "chalk";

const LOGGING_METHOD = ["wait", "error", "warn", "info", "event"] as const;

type LoggingMethods = (typeof LOGGING_METHOD)[number];

const mapLoggingMethodToConsole: Record<LoggingMethods, "log" | "error" | "warn" | "log"> = {
  wait: "log",
  error: "error",
  warn: "warn",
  info: "log",
  event: "log",
};

const prefixes = {
  wait: `${chalk.white(chalk.bold("○"))} (serwist)`,
  error: `${chalk.red(chalk.bold("X"))} (serwist)`,
  warn: `${chalk.yellow(chalk.bold("⚠"))} (serwist)`,
  info: `${chalk.white(chalk.bold("○"))} (serwist)`,
  event: `${chalk.green(chalk.bold("✓"))} (serwist)`,
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
    console[consoleMethod](` ${prefix}`, ...message);
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
