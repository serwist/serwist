import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { cyan, red, yellow } from "kolorist";

export type LogType = "error" | "warn" | "info";
export type LogLevel = LogType | "silent";
export interface LogOptions {
  clear?: boolean;
  skipLine?: boolean;
}
export const LogLevels: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
};

export interface LoggerOptions {
  prefix?: string;
  showVersion?: boolean;
  allowClearScreen?: boolean;
}

export interface Logger {
  info(msg: string, options?: LogOptions): void;
  warn(msg: string, options?: LogOptions): void;
  warnOnce(msg: string, options?: LogOptions): void;
  error(msg: string, options?: LogOptions): void;
  clearScreen(type: LogType): void;
}

const require = createRequire(import.meta.url);

export const createLogger = (level: LogLevel = "info", options: LoggerOptions = {}): Logger => {
  const { prefix: _prefix = "serwist", showVersion = true, allowClearScreen = true } = options;
  const packageJson = showVersion ? JSON.parse(readFileSync(require.resolve("@serwist/utils/package.json"), "utf-8")) : null;
  const prefix = `${_prefix}${showVersion ? ` v${packageJson.version}` : ""}`;
  const thresh = LogLevels[level];
  const canClearScreen = allowClearScreen && process.stdout.isTTY && !process.env.CI;
  const clear = canClearScreen ? console.clear : () => {};
  const output = (type: LogType, msg: string, options: LogOptions = {}) => {
    if (thresh >= LogLevels[type]) {
      const method = type === "info" ? "log" : type;
      if (options.clear) clear();
      let tag = type === "error" ? red(prefix) : type === "warn" ? yellow(prefix) : cyan(prefix);
      console[method](`${options.skipLine ? "\n" : ""}${tag} ${msg}`);
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
