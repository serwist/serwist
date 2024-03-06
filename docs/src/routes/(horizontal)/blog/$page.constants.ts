import type { BlogEntry } from "./$page.types";

export const BLOG_ENTRIES = [
  {
    title: "Serwist 9.0.0",
    description: "This major version aims to clean house after the initial forking.",
    date: "2024-03-10",
    href: "/blog/2024/03/10/serwist-v9",
    keyPoints: [
      {
        title: "Dropped the CommonJS build",
        id: "migrated-to-being-esm-only",
      },
      {
        title: "Migrated to Zod",
        id: "migrated-to-zod",
      },
      {
        title: "Support concurrent precaching",
        id: "support-concurrent-precaching",
      },
      {
        title: "Dropped support for using string handlers with registerRuntimeCaching",
        id: "dropped-support-for-runtime-caching-string-handlers",
      },
      {
        title: "Moved Svelte integration into a separate package",
        id: "moved-svelte-integration-into-a-separate-package",
      },
    ],
  },
] satisfies BlogEntry[];
