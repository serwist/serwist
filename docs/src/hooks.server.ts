import { githubDark } from "$lib/themes/github-dark";
import { githubLight } from "$lib/themes/github-light";
import type { Handle } from "@sveltejs/kit";
import { getHighlighter } from "shiki";

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.highlighter = await getHighlighter({
    langs: ["bash", "json", "typescript", "javascript", "tsx", "jsx"],
    themes: [githubDark, githubLight],
  });
  return resolve(event);
};
