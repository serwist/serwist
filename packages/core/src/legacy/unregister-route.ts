import type { Route } from "$lib/route.js";
import type { Router } from "./router.js";
import { getSingletonRouter } from "./singleton-router.js";

/**
 * Unregisters a route from the singleton {@linkcode Router} instance.
 *
 * @param route The route to unregister.
 * @deprecated
 */
export const unregisterRoute = (route: Route): void => {
  getSingletonRouter().unregisterRoute(route);
};
