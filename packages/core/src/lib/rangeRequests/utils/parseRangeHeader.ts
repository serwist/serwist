/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { SerwistError } from "../../../utils/SerwistError.js";
import { assert } from "../../../utils/assert.js";

/**
 * @param rangeHeader A Range: header value.
 * @returns An object with `start` and `end` properties, reflecting
 * the parsed value of the Range: header. If either the `start` or `end` are
 * omitted, then `null` will be returned.
 * @private
 */
export const parseRangeHeader = (
  rangeHeader: string,
): {
  start?: number;
  end?: number;
} => {
  if (process.env.NODE_ENV !== "production") {
    assert!.isType(rangeHeader, "string", {
      moduleName: "@serwist/range-requests",
      funcName: "parseRangeHeader",
      paramName: "rangeHeader",
    });
  }

  const normalizedRangeHeader = rangeHeader.trim().toLowerCase();
  if (!normalizedRangeHeader.startsWith("bytes=")) {
    throw new SerwistError("unit-must-be-bytes", { normalizedRangeHeader });
  }

  // Specifying multiple ranges separate by commas is valid syntax, but this
  // library only attempts to handle a single, contiguous sequence of bytes.
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range#Syntax
  if (normalizedRangeHeader.includes(",")) {
    throw new SerwistError("single-range-only", { normalizedRangeHeader });
  }

  const rangeParts = /(\d*)-(\d*)/.exec(normalizedRangeHeader);
  // We need either at least one of the start or end values.
  if (!rangeParts || !(rangeParts[1] || rangeParts[2])) {
    throw new SerwistError("invalid-range-values", { normalizedRangeHeader });
  }

  return {
    start: rangeParts[1] === "" ? undefined : Number(rangeParts[1]),
    end: rangeParts[2] === "" ? undefined : Number(rangeParts[2]),
  };
};
