import type { SidebarLink } from "$lib/types";

export const DOCS_SIDEBAR_LINKS = [
  {
    title: "Introduction",
    href: "/docs",
  },
  {
    title: "@serwist/build",
    href: "/docs/build",
    children: [
      {
        title: "Configuring",
        href: "/docs/build/configuring",
        children: [
          {
            title: "Base options",
            href: "/docs/build/configuring/base-options",
            children: [
              { title: "additionalPrecacheEntries", href: "/docs/build/configuring/base-options/additional-precache-entries" },
              { title: "disablePrecacheManifest", href: "/docs/build/configuring/base-options/disable-precache-manifest" },
              { title: "dontCacheBustURLsMatching", href: "/docs/build/configuring/base-options/dont-cache-bust-urls-matching" },
              { title: "manifestTransforms", href: "/docs/build/configuring/base-options/manifest-transforms" },
              { title: "maximumFileSizeToCacheInBytes", href: "/docs/build/configuring/base-options/maximum-file-size-to-cache-in-bytes" },
              { title: "modifyURLPrefix", href: "/docs/build/configuring/base-options/modify-url-prefix" },
            ],
          },
          {
            title: "Glob options",
            href: "/docs/build/configuring/glob-options",
            children: [
              { title: "globDirectory", href: "/docs/build/configuring/glob-options/glob-directory" },
              { title: "globFollow", href: "/docs/build/configuring/glob-options/glob-follow" },
              { title: "globIgnores", href: "/docs/build/configuring/glob-options/glob-ignores" },
              { title: "globPatterns", href: "/docs/build/configuring/glob-options/glob-patterns" },
              { title: "globStrict", href: "/docs/build/configuring/glob-options/glob-strict" },
              { title: "templatedURLs", href: "/docs/build/configuring/glob-options/templated-urls" },
            ],
          },
        ],
      },
      {
        title: "InjectManifest",
        href: "/docs/build/inject-manifest",
        children: [{ title: "Configuring", href: "/docs/build/inject-manifest/configuring" }],
      },
      {
        title: "GetManifest",
        href: "/docs/build/get-manifest",
        children: [{ title: "Configuring", href: "/docs/build/get-manifest/configuring" }],
      },
    ],
  },
  {
    title: "@serwist/next",
    href: "/docs/next",
    children: [
      { title: "Getting started", href: "/docs/next/getting-started" },
      {
        title: "Configuring",
        href: "/docs/next/configuring",
        children: [
          { title: "cacheOnNavigation", href: "/docs/next/configuring/cache-on-navigation" },
          { title: "disable", href: "/docs/next/configuring/disable" },
          { title: "register", href: "/docs/next/configuring/register" },
          { title: "reloadOnOnline", href: "/docs/next/configuring/reload-on-online" },
          { title: "scope", href: "/docs/next/configuring/scope" },
          { title: "swUrl", href: "/docs/next/configuring/sw-url" },
        ],
      },
      { title: "Worker exports", href: "/docs/next/worker-exports" },
    ],
  },
  {
    title: "@serwist/sw",
    href: "/docs/sw",
    children: [
      {
        title: "Abstracting away the APIs",
        href: "/docs/sw/abstractions",
        children: [
          {
            title: "disableDevLogs",
            href: "/docs/sw/abstractions/disable-dev-logs",
          },
          {
            title: "fallbacks",
            href: "/docs/sw/abstractions/fallbacks",
          },
          {
            title: "handlePrecaching",
            href: "/docs/sw/abstractions/handle-precaching",
          },
          {
            title: "Serwist",
            href: "/docs/sw/abstractions/serwist",
          },
          {
            title: "registerRuntimeCaching",
            href: "/docs/sw/abstractions/register-runtime-caching",
          },
        ],
      },
      {
        title: "Background synchronizing",
        href: "/docs/sw/background-syncing",
        children: [
          {
            title: "BackgroundSyncPlugin",
            href: "/docs/sw/background-syncing/background-sync-plugin",
          },
          {
            title: "BackgroundSyncQueue",
            href: "/docs/sw/background-syncing/background-sync-queue",
          },
        ],
      },
      {
        title: "Broadcasting cache updates",
        href: "/docs/sw/broadcasting-updates",
        children: [
          {
            title: "BroadcastCacheUpdate",
            href: "/docs/sw/broadcasting-updates/broadcast-cache-update",
          },
          {
            title: "BroadcastUpdatePlugin",
            href: "/docs/sw/broadcasting-updates/broadcast-update-plugin",
          },
          {
            title: "Constants",
            href: "/docs/sw/broadcasting-updates/constants",
          },
          {
            title: "responsesAreSame",
            href: "/docs/sw/broadcasting-updates/responses-are-same",
          },
        ],
      },
      {
        title: "Expiring outdated responses",
        href: "/docs/sw/expiring-outdated-responses",
        children: [
          { title: "CacheExpiration", href: "/docs/sw/expiring-outdated-responses/cache-expiration" },
          { title: "ExpirationPlugin", href: "/docs/sw/expiring-outdated-responses/expiration-plugin" },
        ],
      },
      {
        title: "Navigation preloading",
        href: "/docs/sw/navigation-preloading",
        children: [
          { title: "disableNavigationPreload", href: "/docs/sw/navigation-preloading/disable-navigation-preload" },
          { title: "enableNavigationPreload", href: "/docs/sw/navigation-preloading/enable-navigation-preload" },
          { title: "isNavigationPreloadSupported", href: "/docs/sw/navigation-preloading/is-navigation-preload-supported" },
        ],
      },
      {
        title: "Precaching",
        href: "/docs/sw/precaching",
      },
      {
        title: "Setting cacheability criteria",
        href: "/docs/sw/setting-cacheability-criteria",
        children: [
          { title: "CacheableResponse", href: "/docs/sw/setting-cacheability-criteria/cacheable-response" },
          { title: "CacheableResponsePlugin", href: "/docs/sw/setting-cacheability-criteria/cacheable-response-plugin" },
        ],
      },
    ],
  },
  {
    title: "@serwist/vite",
    href: "/docs/vite",
  },
] satisfies SidebarLink[];
