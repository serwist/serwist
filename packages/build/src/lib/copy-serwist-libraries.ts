/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import { createRequire } from "node:module";

import fse from "fs-extra";
import upath from "upath";

import type { SerwistPackageJSON } from "../types.js";
import { errors } from "./errors.js";

const require = createRequire(import.meta.url);

// Used to filter the libraries to copy based on our package.json dependencies.
const SERWIST_PREFIX = "serwist-";

// The directory within each package containing the final bundles.
const BUILD_DIR = "build";

/**
 * This copies over a set of runtime libraries used by Serwist into a
 * local directory, which should be deployed alongside your service worker file.
 *
 * As an alternative to deploying these local copies, you could instead use
 * Serwist from its official CDN URL.
 *
 * This method is exposed for the benefit of developers using
 * `@serwist/build.injectManifest` who would
 * prefer not to use the CDN copies of Serwist.
 *
 * @param destDirectory The path to the parent directory under which
 * the new directory of libraries will be created.
 * @returns The name of the newly created directory.
 */
export async function copySerwistLibraries(destDirectory: string): Promise<string> {
  const thisPkg: SerwistPackageJSON = require("../../package.json");
  // Use the version string from @serwist/build in the name of the parent
  // directory. This should be safe, because lerna will bump @serwist/build's
  // pkg.version whenever one of the dependent libraries gets bumped, and we
  // care about versioning the dependent libraries.
  const workboxDirectoryName = `serwist-v${thisPkg.version ? thisPkg.version : ""}`;
  const workboxDirectoryPath = upath.join(destDirectory, workboxDirectoryName);
  await fse.ensureDir(workboxDirectoryPath);

  const copyPromises: Array<Promise<void>> = [];
  const librariesToCopy = Object.keys(thisPkg.dependencies || {}).filter((dependency) => dependency.startsWith(SERWIST_PREFIX));

  for (const library of librariesToCopy) {
    // Get the path to the package on the user's filesystem by require-ing
    // the package's `package.json` file via the node resolution algorithm.
    const libraryPath = upath.dirname(require.resolve(`${library}/package.json`));

    const buildPath = upath.join(libraryPath, BUILD_DIR);

    // fse.copy() copies all the files in a directory, not the directory itself.
    // See https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy.md#copysrc-dest-options-callback
    copyPromises.push(fse.copy(buildPath, workboxDirectoryPath));
  }

  try {
    await Promise.all(copyPromises);
    return workboxDirectoryName;
  } catch (error) {
    throw Error(`${errors["unable-to-copy-serwist-libraries"]} ${error instanceof Error ? error.toString() : ""}`);
  }
}
