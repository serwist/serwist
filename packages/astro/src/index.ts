import type { AstroIntegration } from "astro";
import { dev as devPlugin, generateServiceWorker, virtual as virtualPlugin } from "vite-plugin-serwist";
import { createContext, type SerwistAstroContext } from "./lib/context.js";
import { createLogger } from "./lib/logger.js";
import { resolveDefaultOptions } from "./lib/options.js";
import { mainPlugin } from "./plugins/main.js";
import type { PluginOptions } from "./types.js";

export const serwist = (userOptions: PluginOptions = {}): AstroIntegration => {
  let ctx: SerwistAstroContext;
  return {
    name: "serwist",
    hooks: {
      "astro:config:setup"({ updateConfig }) {
        ctx = createContext();
        updateConfig({
          vite: {
            // Astro lists Vite 6 as its dependency for some reasons...
            // @ts-expect-error Vite 7 and Vite 6 incompatibility
            plugins: [mainPlugin(ctx), virtualPlugin(ctx), devPlugin(ctx)],
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
