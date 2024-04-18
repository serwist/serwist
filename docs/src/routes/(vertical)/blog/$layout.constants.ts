import type { BlogEntry } from "./$layout.types";

export const BLOG_ENTRIES = [
  {
    href: "/blog/2024/03/10/serwist-v9",
    title: {
      content: "Serwist 9.0.0",
      id: "serwist-v9",
    },
    description: "This major version aims to clean house after the initial forking.",
    date: "2024-03-10",
    keyPoints: [
      {
        title: "Dropped the CommonJS build",
        id: "dropped-the-commonjs-build",
      },
      {
        title: "Migrated to Zod",
        id: "migrate-to-zod",
      },
      {
        title: "Added support for concurrent precaching",
        id: "concurrent-precaching",
      },
      {
        title: "Removed RuntimeCaching's support for string handlers",
        id: "removed-string-handlers",
      },
      {
        title: "Moved Serwist's Svelte integration into a separate package",
        id: "moved-svelte-integration",
      },
    ],
  },
] satisfies BlogEntry[];
