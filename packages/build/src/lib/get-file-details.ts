/*
  Copyright 2021 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import path from "node:path";
import { globSync } from "glob";
import type { FileDetails, GlobPartial } from "../types.js";
import { errors } from "./errors.js";
import { getFileHash } from "./get-file-hash.js";
import { getFileSize } from "./get-file-size.js";

export const getFileDetails = ({
  globDirectory,
  globFollow,
  globIgnores,
  globPattern,
}: Omit<GlobPartial, "globDirectory" | "globPatterns" | "templatedURLs"> & {
  // This will only be called when globDirectory is not undefined.
  globDirectory: string;
  globPattern: string;
}): {
  globbedFileDetails: FileDetails[];
  warning: string;
} => {
  let globbedFiles: string[];
  let warning = "";

  try {
    globbedFiles = globSync(globPattern, {
      cwd: globDirectory,
      follow: globFollow,
      ignore: globIgnores,
    });
  } catch (err) {
    throw new Error(`${errors["unable-to-glob-files"]} '${err instanceof Error && err.message ? err.message : ""}'`);
  }

  if (globbedFiles.length === 0) {
    warning = `${errors["useless-glob-pattern"]} ${JSON.stringify({ globDirectory, globPattern, globIgnores }, null, 2)}`;
  }

  const globbedFileDetails: FileDetails[] = [];
  for (const file of globbedFiles) {
    const fullPath = path.join(globDirectory, file);
    const fileSize = getFileSize(fullPath);
    if (fileSize !== null) {
      const fileHash = getFileHash(fullPath);
      globbedFileDetails.push({
        file: path.relative(globDirectory, fullPath),
        hash: fileHash,
        size: fileSize,
      });
    }
  }

  return { globbedFileDetails, warning };
};
