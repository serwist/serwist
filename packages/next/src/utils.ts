import crypto from "node:crypto";
import fs from "node:fs";

import type { InjectManifest } from "@serwist/webpack-plugin";

import { logger } from "$utils/index.js";

export const overrideAfterCalledMethod = (
  workboxPlugin: InjectManifest
) => {
  Object.defineProperty(workboxPlugin, "alreadyCalled", {
    get() {
      return false;
    },
    set() {
      // do nothing
    },
  });
};

/**
 * Safely converts anything to boolean
 * @param value The value
 * @param strict Should the conversion be strict
 * @returns The converted value
 */
export const convertBoolean = (value: unknown, strict = true) => {
  switch (typeof value) {
    case "boolean":
      return value;
    case "number":
    case "bigint":
      return value > 0;
    case "object":
      return !(value === null);
    case "string":
      if (!strict) {
        if (value === "false" || value === "0") return false;
        return true;
      }
      return value === "true" || value === "1";
    case "function":
    case "symbol":
      return true;
    case "undefined":
      return false;
  }
};

export const getFileHash = (file: fs.PathOrFileDescriptor) =>
  crypto.createHash("md5").update(fs.readFileSync(file)).digest("hex");

export const getContentHash = (
  file: fs.PathOrFileDescriptor,
  isDev: boolean
) => {
  if (isDev) {
    return "development";
  }
  return getFileHash(file).slice(0, 16);
};

export function assertValue(value: unknown, message: string): asserts value {
  if (!value) {
    logger.error(message);
    throw new Error(message);
  }
}
