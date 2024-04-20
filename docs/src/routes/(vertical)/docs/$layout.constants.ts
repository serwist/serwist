import type { SidebarLink } from "$lib/types";

export const DOCS_SIDEBAR_LINKS = [
  {
    title: "Introduction",
    href: "/docs",
  },
  {
    title: "serwist",
    href: "/docs/serwist",
    children: [
      {
        title: "Using the Serwist API",
        href: "/docs/serwist/core",
        children: [
          {
            title: "BackgroundSyncQueue",
            href: "/docs/serwist/core/background-sync-queue",
          },
          {
            title: "BroadcastCacheUpdate",
            href: "/docs/serwist/core/broadcast-cache-update",
          },
          { title: "CacheableResponse", href: "/docs/serwist/core/cacheable-response" },
          { title: "CacheExpiration", href: "/docs/serwist/core/cache-expiration" },
          {
            title: "Constants",
            href: "/docs/serwist/core/constants",
          },
          {
            title: "disableDevLogs",
            href: "/docs/serwist/core/disable-dev-logs",
          },
          { title: "disableNavigationPreload", href: "/docs/serwist/core/disable-navigation-preload" },
          { title: "enableNavigationPreload", href: "/docs/serwist/core/enable-navigation-preload" },
          { title: "isNavigationPreloadSupported", href: "/docs/serwist/core/is-navigation-preload-supported" },
          {
            title: "Serwist",
            href: "/docs/serwist/core/serwist",
          },
          {
            title: "responsesAreSame",
            href: "/docs/serwist/core/responses-are-same",
          },
        ],
      },
      {
        title: "Using plugins",
        href: "/docs/serwist/plugins",
        children: [
          {
            title: "BackgroundSyncPlugin",
            href: "/docs/serwist/plugins/background-sync-plugin",
          },
          {
            title: "BroadcastUpdatePlugin",
            href: "/docs/serwist/plugins/broadcast-update-plugin",
          },
          { title: "CacheableResponsePlugin", href: "/docs/serwist/plugins/cacheable-response-plugin" },
          { title: "ExpirationPlugin", href: "/docs/serwist/plugins/expiration-plugin" },
        ],
      },
      {
        title: "Diving deeper",
        href: "/docs/serwist/guide",
        children: [
          {
            title: "Background synchronizing",
            href: "/docs/serwist/guide/background-syncing",
          },
          {
            title: "Broadcasting cache updates",
            href: "/docs/serwist/guide/broadcasting-updates",
          },
          {
            title: "Expiring outdated responses",
            href: "/docs/serwist/guide/expiring-outdated-responses",
          },
          {
            title: "Preloading navigations",
            href: "/docs/serwist/guide/navigation-preloading",
          },
          {
            title: "Precaching assets",
            href: "/docs/serwist/guide/precaching",
          },
          {
            title: "Setting cacheability criteria",
            href: "/docs/serwist/guide/setting-cacheability-criteria",
          },
        ],
      },
    ],
  },
  {
    title: "@serwist/build",
    href: "/docs/build",
    children: [
      {
        title: "Configuring",
        href: "/docs/build/configuring",
        children: [
          { title: "additionalPrecacheEntries", href: "/docs/build/configuring/additional-precache-entries" },
          { title: "disablePrecacheManifest", href: "/docs/build/configuring/disable-precache-manifest" },
          { title: "dontCacheBustURLsMatching", href: "/docs/build/configuring/dont-cache-bust-urls-matching" },
          { title: "globDirectory", href: "/docs/build/configuring/glob-directory" },
          { title: "globFollow", href: "/docs/build/configuring/glob-follow" },
          { title: "globIgnores", href: "/docs/build/configuring/glob-ignores" },
          { title: "globPatterns", href: "/docs/build/configuring/glob-patterns" },
          { title: "globStrict", href: "/docs/build/configuring/glob-strict" },
          { title: "injectionPoint", href: "/docs/build/configuring/injection-point" },
          { title: "manifestTransforms", href: "/docs/build/configuring/manifest-transforms" },
          { title: "maximumFileSizeToCacheInBytes", href: "/docs/build/configuring/maximum-file-size-to-cache-in-bytes" },
          { title: "modifyURLPrefix", href: "/docs/build/configuring/modify-url-prefix" },
          { title: "swDest", href: "/docs/build/configuring/sw-dest" },
          { title: "swSrc", href: "/docs/build/configuring/sw-src" },
          { title: "templatedURLs", href: "/docs/build/configuring/templated-urls" },
        ],
      },
    ],
  },
  {
    title: "@serwist/cli",
    href: "/docs/cli",
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
          { title: "additionalPrecacheEntries", href: "/docs/next/configuring/additional-precache-entries" },
          { title: "cacheOnNavigation", href: "/docs/next/configuring/cache-on-navigation" },
          { title: "disable", href: "/docs/next/configuring/disable" },
          { title: "dontCacheBustURLsMatching", href: "/docs/next/configuring/dont-cache-bust-urls-matching" },
          { title: "injectionPoint", href: "/docs/next/configuring/injection-point" },
          { title: "manifestTransforms", href: "/docs/next/configuring/manifest-transforms" },
          { title: "maximumFileSizeToCacheInBytes", href: "/docs/next/configuring/maximum-file-size-to-cache-in-bytes" },
          { title: "modifyURLPrefix", href: "/docs/next/configuring/modify-url-prefix" },
          { title: "register", href: "/docs/next/configuring/register" },
          { title: "reloadOnOnline", href: "/docs/next/configuring/reload-on-online" },
          { title: "scope", href: "/docs/next/configuring/scope" },
          { title: "swDest", href: "/docs/next/configuring/sw-dest" },
          { title: "swSrc", href: "/docs/next/configuring/sw-src" },
          { title: "swUrl", href: "/docs/next/configuring/sw-url" },
        ],
      },
      { title: "Worker exports", href: "/docs/next/worker-exports" },
    ],
  },
  {
    title: "@serwist/vite",
    href: "/docs/vite",
    children: [
      {
        title: "Getting started",
        href: "/docs/vite/getting-started",
      },
      {
        title: "Configuring",
        href: "/docs/vite/configuring",
        children: [
          { title: "additionalPrecacheEntries", href: "/docs/vite/configuring/additional-precache-entries" },
          { title: "base", href: "/docs/vite/configuring/base" },
          { title: "devOptions", href: "/docs/vite/configuring/dev-options" },
          { title: "disable", href: "/docs/vite/configuring/disable" },
          { title: "dontCacheBustURLsMatching", href: "/docs/vite/configuring/dont-cache-bust-urls-matching" },
          { title: "globDirectory", href: "/docs/vite/configuring/glob-directory" },
          { title: "globFollow", href: "/docs/vite/configuring/glob-follow" },
          { title: "globIgnores", href: "/docs/vite/configuring/glob-ignores" },
          { title: "globPatterns", href: "/docs/vite/configuring/glob-patterns" },
          { title: "globStrict", href: "/docs/vite/configuring/glob-strict" },
          { title: "injectionPoint", href: "/docs/vite/configuring/injection-point" },
          { title: "integration", href: "/docs/vite/configuring/integration" },
          { title: "manifestTransforms", href: "/docs/vite/configuring/manifest-transforms" },
          { title: "maximumFileSizeToCacheInBytes", href: "/docs/vite/configuring/maximum-file-size-to-cache-in-bytes" },
          { title: "mode", href: "/docs/vite/configuring/mode" },
          { title: "modifyURLPrefix", href: "/docs/vite/configuring/modify-url-prefix" },
          { title: "plugins", href: "/docs/vite/configuring/plugins" },
          { title: "rollupFormat", href: "/docs/vite/configuring/rollup-format" },
          { title: "rollupOptions", href: "/docs/vite/configuring/rollup-options" },
          { title: "scope", href: "/docs/vite/configuring/scope" },
          { title: "swDest", href: "/docs/vite/configuring/sw-dest" },
          { title: "swSrc", href: "/docs/vite/configuring/sw-src" },
          { title: "swUrl", href: "/docs/vite/configuring/sw-url" },
          { title: "templatedURLs", href: "/docs/vite/configuring/templated-urls" },
          { title: "type", href: "/docs/vite/configuring/type" },
        ],
      },
      { title: "Worker exports", href: "/docs/vite/worker-exports" },
      {
        title: "Recipes",
        href: "/docs/vite/recipes",
        children: [
          {
            title: "SvelteKit",
            href: "/docs/vite/recipes/svelte",
          },
        ],
      },
    ],
  },
] satisfies SidebarLink[];
