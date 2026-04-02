import fs from "node:fs";
import path from "node:path";

// Source: https://github.com/sveltejs/kit/blob/6419d3eaa7bf1b0a756b28f06a73f71fe042de0a/packages/kit/src/utils/filesystem.js
// License: MIT
/**
 * Resolves a file path without extension. Also handles `/index` if the path
 * actually points to a directory.
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
