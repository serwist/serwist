import type { SidebarLinkProps } from "./types";

export const SIDEBAR_LINKS = [
  {
    title: "Introduction",
    href: "/docs",
  },
  {
    title: "@serwist/background-sync",
    href: "/docs/background-sync",
    children: [
      {
        title: "BackgroundSyncPlugin",
        href: "/docs/background-sync/background-sync-plugin",
      },
      {
        title: "Queue",
        href: "/docs/background-sync/queue",
      },
    ],
  },
  {
    title: "@serwist/broadcast-update",
    href: "/docs/broadcast-update",
    children: [
      {
        title: "BroadcastCacheUpdate",
        href: "/docs/broadcast-update/broadcast-cache-update",
      },
      {
        title: "BroadcastUpdatePlugin",
        href: "/docs/broadcast-update/broadcast-update-plugin",
      },
      {
        title: "Constants",
        href: "/docs/broadcast-update/constants",
      },
      {
        title: "responsesAreSame",
        href: "/docs/broadcast-update/responses-are-same",
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
    title: "@serwist/cacheable-response",
    href: "/docs/cacheable-response",
  },
  {
    title: "@serwist/expiration",
    href: "/docs/expiration",
  },
  {
    title: "@serwist/navigation-preload",
    href: "/docs/navigation-preload",
    children: [
      { title: "disable", href: "/docs/navigation-preload/disable" },
      { title: "enable", href: "/docs/navigation-preload/enable" },
      { title: "isSupported", href: "/docs/navigation-preload/isSupported" },
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
    title: "@serwist/precaching",
    href: "/docs/precaching",
  },
  {
    title: "@serwist/sw",
    href: "/docs/sw",
    children: [
      {
        title: "disableDevLogs",
        href: "/docs/sw/disable-dev-logs",
      },
      {
        title: "fallbacks",
        href: "/docs/sw/fallbacks",
      },
      {
        title: "handlePrecaching",
        href: "/docs/sw/handle-precaching",
      },
      {
        title: "installSerwist",
        href: "/docs/sw/install-serwist",
      },
      {
        title: "registerRuntimeCaching",
        href: "/docs/sw/register-runtime-caching",
      },
    ],
  },
  {
    title: "@serwist/vite",
    href: "/docs/vite",
  },
] satisfies SidebarLinkProps[];
