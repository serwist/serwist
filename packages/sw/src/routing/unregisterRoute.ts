import type { Route } from "./Route.js";
import { getOrCreateDefaultRouter } from "./utils/getOrCreateDefaultRouter.js";

/**
 * Unregisters a route from the singleton Router instance.
 *
 * @param route The route to unregister.
 */
export const unregisterRoute = (route: Route): void => {
  const defaultRouter = getOrCreateDefaultRouter();
  defaultRouter.unregisterRoute(route);
};
