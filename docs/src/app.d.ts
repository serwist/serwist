// See https://kit.svelte.dev/docs/types#app
import type { getHighlighter } from "shiki";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      highlighter: Awaited<ReturnType<typeof getHighlighter>>;
      currentBranch: string;
    }
    // interface PageData {}
    // interface Platform {}
  }
}
