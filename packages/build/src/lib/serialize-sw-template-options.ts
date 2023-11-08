import type { GoogleAnalyticsInitializeOptions } from "@serwist/google-analytics/initialize";
import { oneLine as ol } from "common-tags";

import type { RuntimeCaching, SerwistSWTemplateOptions } from "../types.js";
import { stringifyWithoutComments as stringify } from "./stringify-without-comments.js";
import { errors } from "./errors.js";
import { Replacement } from "@rollup/plugin-replace";

const serializeRegExpArray = (regexpArray: RegExp[]) => `[${regexpArray.map((entry) => entry.toString()).join(",")}]`;

const serializeOfflineAnalyticsConfig = (offlineAnalyticsConfig: boolean | GoogleAnalyticsInitializeOptions | undefined) => {
  switch (typeof offlineAnalyticsConfig) {
    case "boolean":
      return `${offlineAnalyticsConfig}`;
    case "object":
      return ol`{
        cacheName: ${offlineAnalyticsConfig.cacheName},
        parameterOverrides: ${JSON.stringify(offlineAnalyticsConfig.parameterOverrides)},
        hitFilter: ${offlineAnalyticsConfig.hitFilter?.toString()}
      }`;
    default:
      return "undefined";
  }
};

const serializeRuntimeCachingHandler = (handler: RuntimeCaching["handler"], options: RuntimeCaching["options"]) => {
  if (typeof handler === "function") {
    return `handler: ${handler.toString()}`;
  }
  if (typeof handler === "object") {
    return `handler: ${handler.handle.toString()}`;
  }
  return ol`
    handler: '${handler}',
    options: {
        ${options?.plugins !== undefined ? `plugins: ${stringify(options.plugins)},` : ""}
        ${options?.cacheName !== undefined ? `cacheName: ${JSON.stringify(options.cacheName)},` : ""}
        ${options?.networkTimeoutSeconds !== undefined ? `networkTimeoutSeconds: ${options.networkTimeoutSeconds},` : ""}
        ${options?.fetchOptions !== undefined ? `fetchOptions: ${JSON.stringify(options.fetchOptions)},` : ""}
        ${options?.matchOptions !== undefined ? `matchOptions: ${JSON.stringify(options.matchOptions)},` : ""}
        ${options?.backgroundSync !== undefined ? `backgroundSync: ${stringify(options.backgroundSync)},` : ""}
        ${options?.broadcastUpdate !== undefined ? `broadcastUpdate: ${stringify(options.broadcastUpdate)},` : ""}
        ${options?.cacheableResponse !== undefined ? `cacheableResponse: ${stringify(options.cacheableResponse)},` : ""}
        ${options?.expiration !== undefined ? `expiration: ${stringify(options.expiration)},` : ""}
        ${options?.precacheFallback !== undefined ? `precacheFallback: ${stringify(options.precacheFallback)},` : ""}
        ${options?.rangeRequests !== undefined ? `rangeRequests: ${options.rangeRequests},` : ""}
    }`;
};

const serializeRuntimeCachingArray = (runtimeCachingArray: RuntimeCaching[]) => {
  return `[${runtimeCachingArray
    .map((entry) => {
      const method = entry.method || "GET";

      if (!entry.urlPattern) {
        throw new Error(errors["urlPattern-is-required"]);
      }

      if (!entry.handler) {
        throw new Error(errors["handler-is-required"]);
      }

      if (entry.options && entry.options.networkTimeoutSeconds && entry.handler !== "NetworkFirst") {
        throw new Error(errors["invalid-network-timeout-seconds"]);
      }

      // urlPattern might be a string, a RegExp object, or a function.
      // If it's a string, it needs to be quoted.
      const matcher = typeof entry.urlPattern === "string" ? JSON.stringify(entry.urlPattern) : entry.urlPattern;

      return ol`{
        urlPattern: ${matcher},
        method: '${method}',
        ${serializeRuntimeCachingHandler(entry.handler, entry.options)}
    }`;
    })
    .join(",")}]`;
};

export const serializeSWTemplateOptions = ({
  cacheId,
  shouldCleanupOutdatedCaches,
  shouldClientsClaim,
  disableDevLogs,
  scriptsToImport,
  shouldRunPrecacheAndRoute,
  manifestEntries,
  navigateFallback,
  navigateFallbackDenylist,
  navigateFallbackAllowlist,
  navigationPreload,
  offlineAnalyticsConfig: offlineGoogleAnalytics,
  runtimeCaching,
  shouldSkipWaiting,
  precacheOptions: { directoryIndex, ignoreURLParametersMatching },
}: SerwistSWTemplateOptions) => {
  return {
    "self.serwist.cacheId": JSON.stringify(cacheId),
    "self.serwist.shouldCleanupOutdatedCaches": `${shouldCleanupOutdatedCaches}`,
    "self.serwist.shouldClientsClaim": `${shouldClientsClaim}`,
    "self.serwist.disableDevLogs": `${disableDevLogs}`,
    "self.serwist.scriptsToImport": JSON.stringify(scriptsToImport),
    "self.serwist.shouldRunPrecacheAndRoute": `${shouldRunPrecacheAndRoute}`,
    "self.serwist.manifestEntries": JSON.stringify(manifestEntries),
    "self.serwist.navigateFallback": JSON.stringify(navigateFallback),
    "self.serwist.navigateFallbackDenylist": serializeRegExpArray(navigateFallbackDenylist),
    "self.serwist.navigateFallbackAllowlist": serializeRegExpArray(navigateFallbackAllowlist),
    "self.serwist.navigationPreload": `${navigationPreload}`,
    "self.serwist.offlineAnalyticsConfig": serializeOfflineAnalyticsConfig(offlineGoogleAnalytics),
    "self.serwist.runtimeCaching": serializeRuntimeCachingArray(runtimeCaching),
    "self.serwist.shouldSkipWaiting": `${shouldSkipWaiting}`,
    "self.serwist.precacheOptions": `{
      directoryIndex: ${JSON.stringify(directoryIndex)},
      ignoreURLParametersMatching: ${ignoreURLParametersMatching ? serializeRegExpArray(ignoreURLParametersMatching) : undefined},
    }`,
  } satisfies Record<`self.serwist.${keyof SerwistSWTemplateOptions}`, Replacement>;
};
