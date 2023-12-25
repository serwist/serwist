import type { Plugin } from "vite";

import { generateBundle } from "../api.js";
import type { SerwistViteContext } from "../context.js";
import { injectServiceWorker } from "../html.js";
import type { SerwistViteApi } from "../types.js";

export const buildPlugin = (ctx: SerwistViteContext, api: SerwistViteApi) => {
  const transformIndexHtmlHandler = (html: string) => {
    const { options, useImportRegister } = ctx;
    if (options.disable) return html;

    // if virtual register is requested, do not inject.
    if (options.injectRegister === "auto") options.injectRegister = useImportRegister ? null : "script";

    return injectServiceWorker(html, options, false);
  };

  return <Plugin>{
    name: "@serwist/vite:build",
    enforce: "post",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        return transformIndexHtmlHandler(html);
      },
      enforce: "post", // deprecated since Vite 4
      async transform(html) {
        // deprecated since Vite 4
        return transformIndexHtmlHandler(html);
      },
    },
    generateBundle(_, bundle) {
      return generateBundle(ctx, bundle);
    },
    closeBundle: {
      sequential: true,
      order: ctx.userOptions?.integration?.closeBundleOrder,
      async handler() {
        if (!ctx.viteConfig.build.ssr && !ctx.options.disable) await api.generateSW();
      },
    },
    async buildEnd(error) {
      if (error) throw error;
    },
  };
};
