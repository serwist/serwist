import type { AstroIntegration } from "astro";
import { dev as devPlugin, frameworks as frameworksPlugin, generateServiceWorker } from "vite-plugin-serwist";
import type { PluginOptions } from "./types.js";
import { createContext, type SerwistAstroContext } from "./lib/context.js";
import { mainPlugin } from "./plugins/main.js";
import { createLogger } from "./lib/logger.js";
import { resolveDefaultOptions } from "./lib/options.js";

export const serwist = (userOptions: PluginOptions = {}): AstroIntegration => {
  let ctx: SerwistAstroContext;
  return {
    name: "serwist",
    hooks: {
      "astro:config:setup"({ updateConfig }) {
        ctx = createContext();
        updateConfig({
          vite: {
            plugins: [mainPlugin(ctx), frameworksPlugin(ctx), devPlugin(ctx)],
          },
        });
      },
      "astro:config:done"({ config, logger }) {
        ctx.userOptions = resolveDefaultOptions(config, userOptions);
        ctx.logger = createLogger(logger, config.vite.logLevel || "info");
      },
      async "astro:build:done"() {
        if (!ctx.options.disable) {
          await generateServiceWorker(ctx);
        }
      },
    },
  } satisfies AstroIntegration;
};
