/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { Result as MeowResult } from "meow";
import meow from "meow";
import updateNotifier, { type Package } from "update-notifier";
import { app } from "./app.js";
import { cleanupStackTrace } from "./lib/cleanup-stack-trace.js";
import { helpText } from "./lib/help-text.js";
import { logger } from "./lib/logger.js";
import type { AnyFlags, BooleanFlag } from "./types.js";

export interface SupportedFlags extends AnyFlags {
  debug: BooleanFlag;
  watch: BooleanFlag;
}

void (async () => {
  const params: MeowResult<any> = meow(helpText, {
    importMeta: import.meta,
  });

  updateNotifier({ pkg: params.pkg as Package }).notify();

  try {
    await app(params);
  } catch (error) {
    if (error instanceof Error) {
      // Show the full error and stack trace if we're run with --debug.
      if (params.flags.debug) {
        if (error.stack) {
          logger.error(`\n${error.stack}`);
        }
      } else {
        logger.error(`\n${error.message}`);
        logger.debug(`${cleanupStackTrace(error, "app.js")}\n`);
      }
    }

    process.exit(1);
  }
})();
