/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { ManifestEntry } from "../types.js";
import { errors } from "./errors.js";

type AdditionalManifestEntriesTransform = (manifest: (ManifestEntry & { size: number })[]) => {
  manifest: (ManifestEntry & { size: number })[];
  warnings: string[];
};

export const additionalPrecacheEntriesTransform = (additionalPrecacheEntries: (ManifestEntry | string)[]): AdditionalManifestEntriesTransform => {
  return (manifest: (ManifestEntry & { size: number })[]) => {
    const warnings: string[] = [];
    const stringEntries = new Set<string>();

    for (const additionalEntry of additionalPrecacheEntries) {
      // Warn about either a string or an object that lacks a revision property.
      // (An object with a revision property set to null is okay.)
      if (typeof additionalEntry === "string") {
        stringEntries.add(additionalEntry);
        manifest.push({
          revision: null,
          size: 0,
          url: additionalEntry,
        });
      } else {
        if (additionalEntry && !additionalEntry.integrity && additionalEntry.revision === undefined) {
          stringEntries.add(additionalEntry.url);
        }
        manifest.push(Object.assign({ size: 0 }, additionalEntry));
      }
    }

    if (stringEntries.size > 0) {
      let urls = "\n";
      for (const stringEntry of stringEntries) {
        urls += `  - ${stringEntry}\n`;
      }

      warnings.push(errors["string-entry-warning"] + urls);
    }

    return {
      manifest,
      warnings,
    };
  };
};
