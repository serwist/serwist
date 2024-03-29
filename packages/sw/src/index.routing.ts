import type { NavigationRouteMatchOptions } from "./routing/NavigationRoute.js";
import { NavigationRoute } from "./routing/NavigationRoute.js";
import { RegExpRoute } from "./routing/RegExpRoute.js";
import { Route } from "./routing/Route.js";
import { Router } from "./routing/Router.js";
import { registerRoute } from "./routing/registerRoute.js";
import { setCatchHandler } from "./routing/setCatchHandler.js";
import { setDefaultHandler } from "./routing/setDefaultHandler.js";
import { unregisterRoute } from "./routing/unregisterRoute.js";
import type { HTTPMethod } from "./routing/utils/constants.js";

export { NavigationRoute, RegExpRoute, registerRoute, Route, Router, setCatchHandler, setDefaultHandler, unregisterRoute };

export type { HTTPMethod, NavigationRouteMatchOptions };
