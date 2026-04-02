import crypto from "node:crypto";
import type { FileDetails } from "../types.js";

export const getStringHash = (input: crypto.BinaryLike): string => {
  const md5 = crypto.createHash("md5");
  md5.update(input);
  return md5.digest("hex");
};

export const getStringDetails = (url: string, str: string): FileDetails => ({
  file: url,
  hash: getStringHash(str),
  size: str.length,
});
