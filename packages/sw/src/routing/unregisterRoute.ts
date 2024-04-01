import type { Route } from "./Route.js";
import { getSingletonRouter } from "./singletonRouter.js";

/**
 * Unregisters a route from the singleton `Router` instance.
 *
 * @param route The route to unregister.
 */
export const unregisterRoute = (route: Route): void => {
  getSingletonRouter().unregisterRoute(route);
};
