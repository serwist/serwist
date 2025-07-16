/*
  Copyright 2021 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import fs from "node:fs";
import path from "node:path";
import { toUnix } from "@serwist/utils";
import { errors } from "./errors.js";

export function translateURLToSourcemapPaths(
  url: string | null,
  swSrc: string,
  swDest: string,
): {
  destPath: string | undefined;
  srcPath: string | undefined;
  warning: string | undefined;
} {
  let destPath: string | undefined ;
  let srcPath: string | undefined ;
  let warning: string | undefined ;

  if (url && !url.startsWith("data:")) {
    const possibleSrcPath = path.resolve(path.dirname(swSrc), url);
    if (fs.existsSync(possibleSrcPath)) {
      srcPath = toUnix(possibleSrcPath);
      destPath = toUnix(path.resolve(path.dirname(swDest), url));
    } else {
      warning = `${errors["cant-find-sourcemap"]} ${possibleSrcPath}`;
    }
  }

  return { destPath, srcPath, warning };
}
