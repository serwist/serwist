/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { MapLikeObject } from "../../types.js";
import { type MessageKey, messages } from "./messages.js";

const fallback = (code: string, ...args: any[]) => {
  let msg = code;
  if (args.length > 0) {
    msg += ` :: ${JSON.stringify(args)}`;
  }
  return msg;
};

const generatorFunction = (code: MessageKey, details: MapLikeObject = {}) => {
  const message = messages[code];
  if (!message) {
    throw new Error(`Unable to find message for code '${code}'.`);
  }

  return message(details);
};

export const messageGenerator = process.env.NODE_ENV === "production" ? fallback : generatorFunction;
