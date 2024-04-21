/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { SerwistError } from "../../utils/SerwistError.js";
import { assert } from "../../utils/assert.js";
import { getFriendlyURL } from "../../utils/getFriendlyURL.js";
import { logger } from "../../utils/logger.js";

export interface CacheableResponseOptions {
  /**
   * One or more status codes that a `Response` can have to be considered cacheable.
   */
  statuses?: number[];
  /**
   * A mapping of header names and expected values that a `Response` can have and be
   * considered cacheable. If multiple headers are provided, only one needs to be present.
   */
  headers?: HeadersInit;
}

/**
 * Allows you to set up rules determining what status codes and/or headers need
 * to be present in order for a [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
 * to be considered cacheable.
 */
export class CacheableResponse {
  private readonly _statuses?: CacheableResponseOptions["statuses"];
  private readonly _headers?: Headers;

  /**
   * To construct a new CacheableResponse instance you must provide at least
   * one of the `config` properties.
   *
   * If both `statuses` and `headers` are specified, then both conditions must
   * be met for the `Response` to be considered cacheable.
   *
   * @param config
   */
  constructor(config: CacheableResponseOptions = {}) {
    if (process.env.NODE_ENV !== "production") {
      if (!(config.statuses || config.headers)) {
        throw new SerwistError("statuses-or-headers-required", {
          moduleName: "serwist",
          className: "CacheableResponse",
          funcName: "constructor",
        });
      }

      if (config.statuses) {
        assert!.isArray(config.statuses, {
          moduleName: "serwist",
          className: "CacheableResponse",
          funcName: "constructor",
          paramName: "config.statuses",
        });
      }

      if (config.headers) {
        assert!.isType(config.headers, "object", {
          moduleName: "serwist",
          className: "CacheableResponse",
          funcName: "constructor",
          paramName: "config.headers",
        });
      }
    }

    this._statuses = config.statuses;
    if (config.headers) {
      this._headers = new Headers(config.headers);
    }
  }

  /**
   * Checks a response to see whether it's cacheable or not.
   *
   * @param response The response whose cacheability is being
   * checked.
   * @returns `true` if the `Response` is cacheable, and `false`
   * otherwise.
   */
  isResponseCacheable(response: Response): boolean {
    if (process.env.NODE_ENV !== "production") {
      assert!.isInstance(response, Response, {
        moduleName: "serwist",
        className: "CacheableResponse",
        funcName: "isResponseCacheable",
        paramName: "response",
      });
    }

    let cacheable = true;

    if (this._statuses) {
      cacheable = this._statuses.includes(response.status);
    }

    if (this._headers && cacheable) {
      for (const [headerName, headerValue] of this._headers.entries()) {
        if (response.headers.get(headerName) !== headerValue) {
          cacheable = false;
          break;
        }
      }
    }

    if (process.env.NODE_ENV !== "production") {
      if (!cacheable) {
        logger.groupCollapsed(
          `The request for '${getFriendlyURL(response.url)}' returned a response that does not meet the criteria for being cached.`,
        );

        logger.groupCollapsed("View cacheability criteria here.");
        logger.log(`Cacheable statuses: ${JSON.stringify(this._statuses)}`);
        logger.log(`Cacheable headers: ${JSON.stringify(this._headers, null, 2)}`);
        logger.groupEnd();

        const logFriendlyHeaders: { [key: string]: string } = {};
        response.headers.forEach((value, key) => {
          logFriendlyHeaders[key] = value;
        });

        logger.groupCollapsed("View response status and headers here.");
        logger.log(`Response status: ${response.status}`);
        logger.log(`Response headers: ${JSON.stringify(logFriendlyHeaders, null, 2)}`);
        logger.groupEnd();

        logger.groupCollapsed("View full response details here.");
        logger.log(response.headers);
        logger.log(response);
        logger.groupEnd();

        logger.groupEnd();
      }
    }

    return cacheable;
  }
}
