import { githubDark } from "$lib/themes/github-dark";
import { githubLight } from "$lib/themes/github-light";
import type { Handle } from "@sveltejs/kit";
import { getHighlighter } from "shiki";

const highlighter = await getHighlighter({
  langs: ["bash", "json", "typescript", "javascript", "tsx", "jsx", "svelte", "html", "vue"],
  themes: [githubDark, githubLight],
});

export const handle: Handle = ({ event, resolve }) => {
  event.locals.highlighter = highlighter;
  return resolve(event);
};
