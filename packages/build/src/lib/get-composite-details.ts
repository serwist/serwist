/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { FileDetails } from "@serwist/utils";
import crypto from "node:crypto";

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
