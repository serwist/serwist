// Source: https://github.com/sveltejs/kit/blob/6419d3eaa7bf1b0a756b28f06a73f71fe042de0a/packages/kit/src/utils/filesystem.js
// License: MIT
/**
 * Internal function used by `vite-plugin-serwist`.
 * Converts a filesystem path to a Vite `@fs` URL.
 * @internal
 * @param ctx
 * @param api
 * @returns
 */
export const toFs = (str: string) => {
  str = str.replace(/\\/g, "/");
  // Windows/Linux separation - Windows starts with a drive letter, we need a / in front there
  return `/@fs${str.startsWith("/") ? "" : "/"}${str}`;
};
