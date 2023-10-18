/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { logger } from "../_private/logger.js";

// A SerwistCore instance must be exported before we can use the logger.
// This is so it can get the current log level.
if (process.env.NODE_ENV !== "production") {
  const padding = "   ";
  logger.groupCollapsed("Welcome to Serwist!");
  logger.log(
    `You are currently using a development build. ` +
      `By default this will switch to prod builds when not on localhost. ` +
      `You can force this with serwist.setConfig({debug: true|false}).`
  );
  logger.log(`📖 Read the guides and documentation\n` + `${padding}https://developers.google.com/web/tools/workbox/`);
  logger.log(`❓ Use the Discussions tab on Github to ask questions\n` + `${padding}https://github.com/serwist/serwist/discussions`);
  logger.log(`🐛 Found a bug? Report it on GitHub\n` + `${padding}https://github.com/serwist/serwist/issues/new`);
  logger.groupEnd();
}
