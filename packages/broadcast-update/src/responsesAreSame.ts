/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { logger, SerwistError } from "@serwist/core/internal";

/**
 * Given two `Response's`, compares several header values to see if they are
 * the same or not.
 *
 * @param firstResponse
 * @param secondResponse
 * @param headersToCheck
 * @returns
 */
const responsesAreSame = (firstResponse: Response, secondResponse: Response, headersToCheck: string[]): boolean => {
  if (process.env.NODE_ENV !== "production") {
    if (!(firstResponse instanceof Response && secondResponse instanceof Response)) {
      throw new SerwistError("invalid-responses-are-same-args");
    }
  }

  const atLeastOneHeaderAvailable = headersToCheck.some((header) => {
    return firstResponse.headers.has(header) && secondResponse.headers.has(header);
  });

  if (!atLeastOneHeaderAvailable) {
    if (process.env.NODE_ENV !== "production") {
      logger.warn(`Unable to determine where the response has been updated ` + `because none of the headers that would be checked are present.`);
      logger.debug(`Attempting to compare the following: `, firstResponse, secondResponse, headersToCheck);
    }

    // Just return true, indicating the that responses are the same, since we
    // can't determine otherwise.
    return true;
  }

  return headersToCheck.every((header) => {
    const headerStateComparison = firstResponse.headers.has(header) === secondResponse.headers.has(header);
    const headerValueComparison = firstResponse.headers.get(header) === secondResponse.headers.get(header);

    return headerStateComparison && headerValueComparison;
  });
};

export { responsesAreSame };
