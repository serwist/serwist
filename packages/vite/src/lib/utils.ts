import fs from "node:fs";
import path from "node:path";

import type { ResolvedConfig } from "vite";

export const slash = (str: string) => {
  return str.replace(/\\/g, "/");
};

export const resolveBasePath = (base: string) => {
  if (isAbsolute(base)) return base;
  return !base.startsWith("/") && !base.startsWith("./") ? `/${base}` : base;
};

export const isAbsolute = (url: string) => {
  return url.match(/^(?:[a-z]+:)?\/\//i);
};

export const normalizePath = (path: string) => {
  return path.replace(/\\/g, "/");
};

// Source: https://github.com/sveltejs/kit/blob/6419d3eaa7bf1b0a756b28f06a73f71fe042de0a/packages/kit/src/utils/filesystem.js
// License: MIT
/**
 * Internal function used by `@serwist/vite`.
 * Resolves a file path without extension. Also handles `/index` if the path
 * actually points to a directory.
 * @internal
 * @param ctx
 * @param api
 * @returns
 */
export const resolveEntry = (entry: string): string | null => {
  if (fs.existsSync(entry)) {
    const stats = fs.statSync(entry);
    if (stats.isDirectory()) {
      return resolveEntry(path.join(entry, "index"));
    }

    return entry;
  }
  const dir = path.dirname(entry);

  if (fs.existsSync(dir)) {
    const base = path.basename(entry);
    const files = fs.readdirSync(dir);

    const found = files.find((file) => file.replace(/\.[^.]+$/, "") === base);

    if (found) return path.join(dir, found);
  }

  return null;
};

// Source: https://github.com/sveltejs/kit/blob/6419d3eaa7bf1b0a756b28f06a73f71fe042de0a/packages/kit/src/utils/filesystem.js
// License: MIT
/**
 * Internal function used by `@serwist/vite`.
 * Converts a filesystem path to a Vite `@fs` URL.
 * @internal
 * @param ctx
 * @param api
 * @returns
 */
export const toFs = (str: string) => {
  str = str.replace(/\\/g, "/");
  // Windows/Linux separation - Windows starts with a drive letter, we need a / in front there
  return `/@fs${str.startsWith("/") ? "" : "/"}${str}`;
};

/**
 * Whether the running Vite supports the environments API, i.e. whether our
 * `applyToEnvironment` filters are honored. Vite 5 leaves `config.environments`
 *  undefined and silently ignores `applyToEnvironment`.
 * @internal
 * @param config
 * @returns
 */
export const isEnvironmentsCapable = (config: ResolvedConfig): boolean => {
  return "environments" in config;
};

/**
 * Vite does not export `PartialEnvironment`.
 * @internal
 */
export type PartialEnvironment = Parameters<NonNullable<import("vite").Plugin["applyToEnvironment"]>>[0];

/**
 * Whether the given environment is the primary client environment. This
 * prevents a second client environment from triggering an additional service
 * worker build writing over the same `swDest`.
 * @internal
 * @param environment
 * @returns
 */
export const isPrimaryClientEnvironment = (environment: PartialEnvironment): boolean => {
  if (environment.config.consumer !== "client") {
    return false;
  }
  const environments = environment.getTopLevelConfig().environments;
  if (!environments) {
    // Nothing to compare against, apply to the client environment we got.
    return true;
  }
  if (environments.client) {
    return environment.name === "client";
  }
  const [primary] = Object.keys(environments).filter((name) => environments[name].consumer === "client");
  return environment.name === primary;
};
