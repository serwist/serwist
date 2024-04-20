import { githubDark } from "$lib/themes/github-dark";
import { githubLight } from "$lib/themes/github-light";
import type { Handle } from "@sveltejs/kit";
import { getHighlighter, type Highlighter } from "shiki";

let highlighter: Highlighter | null = null;

export const handle: Handle = async ({ event, resolve }) => {
  if (!highlighter) {
    highlighter = await getHighlighter({
      langs: ["bash", "json", "typescript", "javascript", "tsx", "jsx", "svelte", "html"],
      themes: [githubDark, githubLight],
    });
  }
  event.locals.highlighter = highlighter;
  return resolve(event);
};
