import type { NavigationRouteMatchOptions } from "./routing/NavigationRoute.js";
import { NavigationRoute } from "./routing/NavigationRoute.js";
import { RegExpRoute } from "./routing/RegExpRoute.js";
import { Route } from "./routing/Route.js";
import { Router } from "./routing/Router.js";
import { parseRoute } from "./routing/parseRoute.js";
import { registerRoute } from "./routing/registerRoute.js";
import { setCatchHandler } from "./routing/setCatchHandler.js";
import { setDefaultHandler } from "./routing/setDefaultHandler.js";
import { getSingletonRouter, setSingletonRouter } from "./routing/singletonRouter.js";
import { unregisterRoute } from "./routing/unregisterRoute.js";
import type { HTTPMethod } from "./routing/utils/constants.js";

export {
  NavigationRoute,
  RegExpRoute,
  parseRoute,
  registerRoute,
  Route,
  Router,
  setCatchHandler,
  setDefaultHandler,
  getSingletonRouter,
  setSingletonRouter,
  unregisterRoute,
};

export type { HTTPMethod, NavigationRouteMatchOptions };
