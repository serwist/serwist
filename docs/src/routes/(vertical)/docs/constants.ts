import type { SidebarLinkProps } from "./types";

export const SIDEBAR_LINKS = [
  {
    title: "Introduction",
    href: "/docs",
  },
  {
    title: "@serwist/next",
    href: "/docs/next",
    children: [{ title: "Getting started", href: "/docs/next/getting-started" }],
  },
] satisfies SidebarLinkProps[];
