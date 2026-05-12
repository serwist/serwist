import type { Plugin } from "vite";
import type { SerwistViteContext } from "../lib/context.js";
import { loadVirtual, resolveVirtualId } from "../lib/modules.js";

/**
 * `vite-plugin-serwist`'s virtual modules plugin. Only used for when you
 * don't use `vite-plugin-serwist`'s `main` plugin.
 * @param ctx
 * @param api
 * @returns
 */
export const virtualPlugin = (ctx: SerwistViteContext): Plugin => {
  return {
    name: "vite-plugin-serwist:virtual",
    resolveId(id) {
      return resolveVirtualId(id);
    },
    load(id) {
      return loadVirtual(id, ctx);
    },
  } satisfies Plugin;
};
