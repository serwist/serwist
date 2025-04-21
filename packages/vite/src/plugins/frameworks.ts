import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import type { Plugin } from "vite";
import { VIRTUAL_FRAMEWORKS_MAP, VIRTUAL_PREFIX, VIRTUAL_SERWIST_RESOLVED, VIRTUAL_SERWIST } from "../lib/constants.js";
import type { SerwistViteContext } from "../lib/context.js";
import type { VirtualFrameworks } from "../lib/types.js";

const require = createRequire(import.meta.url);

/**
 * Internal frameworks plugin used by `vite-plugin-serwist`.
 * @internal
 * @param ctx
 * @param api
 * @returns
 */
export const frameworksPlugin = (ctx: SerwistViteContext): Plugin => {
  return {
    name: "vite-plugin-serwist:frameworks",
    resolveId(id) {
      if (id.startsWith(VIRTUAL_SERWIST)) {
        return `${VIRTUAL_PREFIX}${id}`;
      }
      return undefined;
    },
    load(id) {
      if (id === VIRTUAL_SERWIST_RESOLVED) {
        return `import { Serwist } from "@serwist/window";
export const swUrl = "${path.posix.join(ctx.options.base, ctx.options.swUrl)}";
export const swScope = "${ctx.options.scope}";
export const swType = "${ctx.devEnvironment ? "module" : ctx.options.type}";
export const getSerwist = () => {
  if ("serviceWorker" in navigator) {
    return new Serwist(swUrl, { scope: swScope, type: swType });
  }
  return undefined;
}`;
      }
      if (Object.hasOwn(VIRTUAL_FRAMEWORKS_MAP, id)) {
        const framework = VIRTUAL_FRAMEWORKS_MAP[id as VirtualFrameworks];
        const content = readFileSync(
          path.resolve(
            require.resolve("vite-plugin-serwist"),
            "../client",
            framework.startsWith(".") ? `./index${framework}.js` : `.${framework}.js`,
          ),
          "utf-8",
        );
        return content;
      }
      return undefined;
    },
  } satisfies Plugin;
};
