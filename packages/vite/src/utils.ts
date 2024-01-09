import fs from "node:fs";
import path from "node:path";

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
export function toFs(str: string) {
  str = str.replace(/\\/g, "/");
  // Windows/Linux separation - Windows starts with a drive letter, we need a / in front there
  return `/@fs${str.startsWith("/") ? "" : "/"}${str}`;
}
