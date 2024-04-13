/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { SerwistError } from "../../../utils/SerwistError.js";
import { assert } from "../../../utils/assert.js";

/**
 * @param blob A source blob.
 * @param start The offset to use as the start of the
 * slice.
 * @param end The offset to use as the end of the slice.
 * @returns An object with `start` and `end` properties, reflecting
 * the effective boundaries to use given the size of the blob.
 * @private
 */
export const calculateEffectiveBoundaries = (blob: Blob, start?: number, end?: number): { start: number; end: number } => {
  if (process.env.NODE_ENV !== "production") {
    assert!.isInstance(blob, Blob, {
      moduleName: "@serwist/range-requests",
      funcName: "calculateEffectiveBoundaries",
      paramName: "blob",
    });
  }

  const blobSize = blob.size;

  if ((end && end > blobSize) || (start && start < 0)) {
    throw new SerwistError("range-not-satisfiable", {
      size: blobSize,
      end,
      start,
    });
  }

  let effectiveStart: number;
  let effectiveEnd: number;

  if (start !== undefined && end !== undefined) {
    effectiveStart = start;
    // Range values are inclusive, so add 1 to the value.
    effectiveEnd = end + 1;
  } else if (start !== undefined && end === undefined) {
    effectiveStart = start;
    effectiveEnd = blobSize;
  } else if (end !== undefined && start === undefined) {
    effectiveStart = blobSize - end;
    effectiveEnd = blobSize;
  }

  return {
    start: effectiveStart!,
    end: effectiveEnd!,
  };
};
