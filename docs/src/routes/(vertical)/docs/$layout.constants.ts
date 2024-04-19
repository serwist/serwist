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
    title: "@serwist/vite",
    href: "/docs/vite",
    children: [
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
