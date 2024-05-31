import type { Route } from "../Route.js";
import type { Router } from "./Router.js";
import { getSingletonRouter } from "./singletonRouter.js";

/**
 * Unregisters a route from the singleton {@linkcode Router} instance.
 *
 * @param route The route to unregister.
 * @deprecated
 */
export const unregisterRoute = (route: Route): void => {
  getSingletonRouter().unregisterRoute(route);
};
