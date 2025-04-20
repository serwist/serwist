import type fs from "node:fs";
import { getFileHash } from "@serwist/utils/node";

export const getContentHash = (file: fs.PathOrFileDescriptor, isDev: boolean) => {
  if (isDev) {
    return "development";
  }
  return getFileHash(file).slice(0, 16);
};
