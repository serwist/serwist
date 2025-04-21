import type { Logger, LogOptions, LoggerOptions, LogLevel, LogType } from "@serwist/utils/node";
import { LogLevels } from "@serwist/utils/node";
import type { AstroIntegrationLogger } from "astro";

export const createLogger = (logger: AstroIntegrationLogger, logLevel: LogLevel, options: Omit<LoggerOptions, "showVersion"> = {}): Logger => {
  const { allowClearScreen = true } = options;
  const thresh = LogLevels[logLevel];
  const canClearScreen = allowClearScreen && process.stdout.isTTY && !process.env.CI;
  const clear = canClearScreen ? console.clear : () => {};
  const output = (type: LogType, msg: string, options: LogOptions = {}) => {
    if (thresh >= LogLevels[type]) {
      if (options.clear) clear();
      const split = msg.split("\n");
      for (const message of split) {
        logger[type](message);
      }
    }
  };
  const warnedMessages = new Set<string>();
  return {
    info(msg, opts) {
      output("info", msg, opts);
    },
    warn(msg, opts) {
      output("warn", msg, opts);
    },
    warnOnce(msg, opts) {
      if (warnedMessages.has(msg)) return;
      output("warn", msg, opts);
      warnedMessages.add(msg);
    },
    error(msg, opts) {
      output("error", msg, opts);
    },
    clearScreen(type) {
      if (thresh >= LogLevels[type]) {
        clear();
      }
    },
  } satisfies Logger;
};
