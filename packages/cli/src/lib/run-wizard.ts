/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { oneLine as ol } from "common-tags";
import fse from "fs-extra";
import stringifyObject from "stringify-object";

import { logger } from "./logger.js";
import { askQuestions } from "./questions/ask-questions.js";

export async function runWizard(options = {}): Promise<void> {
  const { configLocation, config } = await askQuestions(options);

  // See https://github.com/GoogleChrome/workbox/issues/2796
  const contents = `module.exports = ${stringifyObject(config)};`;
  await fse.writeFile(configLocation, contents);

  logger.log(`To build your service worker, run

  serwist injectManifest ${configLocation}

as part of a build process. See https://goo.gl/fdTQBf for details.`);

  const configDocsURL = "injectManifest" in options ? "https://goo.gl/8bs14N" : "https://goo.gl/gVo87N";

  logger.log(ol`You can further customize your service worker by making changes
    to ${configLocation}. See ${configDocsURL} for details.`);
}
