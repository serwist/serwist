/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { logger } from "./logger.js";

// A SerwistCore instance must be exported before we can use the logger.
// This is so it can get the current log level.
if (process.env.NODE_ENV !== "production") {
  const padding = "   ";
  logger.groupCollapsed("Welcome to Serwist!");
  logger.log(`📖 Read the guides and documentation\n${padding}https://serwist.pages.dev/`);
  logger.log(`🐛 Found a bug or want to ask a question? Open a new issue on GitHub\n${padding}https://github.com/serwist/serwist/issues/new/choose`);
  logger.groupEnd();
}
