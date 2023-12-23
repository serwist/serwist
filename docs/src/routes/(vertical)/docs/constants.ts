import type { SidebarLinkProps } from "./types";

export const SIDEBAR_LINKS = [
  {
    title: "Introduction",
    href: "/docs",
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
          { title: "cacheOnFrontEndNav", href: "/docs/next/configuring/cache-on-front-end-nav" },
          { title: "disable", href: "/docs/next/configuring/disable" },
          { title: "register", href: "/docs/next/configuring/register" },
          { title: "reloadOnOnline", href: "/docs/next/configuring/reload-on-online" },
          { title: "scope", href: "/docs/next/configuring/scope" },
          { title: "swUrl", href: "/docs/next/configuring/sw-url" },
        ],
      },
      { title: "Browser exports", href: "/docs/next/browser-exports" },
    ],
  },
  {
    title: "@serwist/sw",
    href: "/docs/sw",
    children: [{ title: "installSerwist", href: "/docs/sw/install-serwist" }],
  },
] satisfies SidebarLinkProps[];
