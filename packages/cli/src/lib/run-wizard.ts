/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import { writeFileSync } from "node:fs";
import stringifyObject from "stringify-object";

import { askQuestions } from "./ask-questions.js";
import { logger } from "./logger.js";

export async function runWizard(): Promise<void> {
  const { configLocation, config } = await askQuestions();

  const contents = `/** @type {import("@serwist/build").InjectManifestOptions} */\nexport default ${stringifyObject(config)};`;

  writeFileSync(configLocation, contents);

  logger.log(`To build your service worker, run

  serwist inject-manifest ${configLocation}

as part of a build process.`);

  logger.log(
    `You can further customize your service worker by making changes to ${configLocation}. See https://serwist.pages.dev/docs/build/configuring for details.`,
  );
}
