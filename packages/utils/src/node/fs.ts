import crypto from "node:crypto";
import fs from "node:fs";
import { getStringHash } from "./hash.js";
import { errors } from "./errors.js";
import type { FileDetails } from "../types.js";

export const getFileHash = (file: fs.PathOrFileDescriptor) => {
  try {
    return getStringHash(fs.readFileSync(file));
  } catch (err) {
    throw new Error(`${errors["unable-to-get-file-hash"]} '${err instanceof Error && err.message ? err.message : ""}'`);
  }
};

export const getFileSize = (file: string): number | null => {
  try {
    const stat = fs.statSync(file);
    if (!stat.isFile()) {
      return null;
    }
    return stat.size;
  } catch (err) {
    throw new Error(`${errors["unable-to-get-file-size"]} '${err instanceof Error && err.message ? err.message : ""}'`);
  }
};

export const getCompositeDetails = (compositeURL: string, dependencyDetails: FileDetails[]): FileDetails => {
  let totalSize = 0;
  let compositeHash = "";

  for (const fileDetails of dependencyDetails) {
    totalSize += fileDetails.size;
    compositeHash += fileDetails.hash === null ? "" : fileDetails.hash;
  }

  const md5 = crypto.createHash("md5");
  md5.update(compositeHash);
  const hashOfHashes = md5.digest("hex");

  return {
    file: compositeURL,
    hash: hashOfHashes,
    size: totalSize,
  };
};
