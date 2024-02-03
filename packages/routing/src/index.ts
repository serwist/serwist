/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { NavigationRouteMatchOptions } from "./NavigationRoute.js";
import { NavigationRoute } from "./NavigationRoute.js";
import { RegExpRoute } from "./RegExpRoute.js";
import { Route } from "./Route.js";
import { Router } from "./Router.js";
import { registerRoute } from "./registerRoute.js";
import { setCatchHandler } from "./setCatchHandler.js";
import { setDefaultHandler } from "./setDefaultHandler.js";
import { unregisterRoute } from "./unregisterRoute.js";
import type { HTTPMethod } from "./utils/constants.js";

export { NavigationRoute, RegExpRoute, registerRoute, Route, Router, setCatchHandler, setDefaultHandler, unregisterRoute };

export type { HTTPMethod, NavigationRouteMatchOptions };
