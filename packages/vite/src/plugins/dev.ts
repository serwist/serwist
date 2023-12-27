import type { Plugin } from "vite";

import type { SerwistViteContext } from "../context.js";

export const devPlugin = (ctx: SerwistViteContext): Plugin => {
  return {
    name: "@serwist/vite:dev",
    apply: "serve",
    configureServer() {
      ctx.devEnvironment = true;
    },
  };
};
