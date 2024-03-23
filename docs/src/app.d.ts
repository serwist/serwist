// See https://kit.svelte.dev/docs/types#app
import type { BlogMetadata, OpenGraphImage, SidebarLink, TocEntry } from "$lib/types";
import type { getHighlighter } from "shiki";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      highlighter: Awaited<ReturnType<typeof getHighlighter>>;
    }
    interface PageData {
      title?: string;
      ogImage?: string;
      toc?: TocEntry[];
      sidebar?: SidebarLink[];
    }
    // interface Platform {}
  }
}
