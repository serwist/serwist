import type fs from "node:fs";

import { getFileHash } from "./get-file-hash.js";

export const getContentHash = (file: fs.PathOrFileDescriptor, isDev: boolean) => {
  if (isDev) {
    return "development";
  }
  return getFileHash(file).slice(0, 16);
};
