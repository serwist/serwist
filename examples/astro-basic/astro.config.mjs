// @ts-check
import { defineConfig } from "astro/config";

import { serwist as serwistVite } from "vite-plugin-serwist/test";
import { LogLevels, resolveEntry } from "@serwist/utils/node";
import path from "node:path";
import { fileURLToPath } from "node:url";

const createLogger = (logger, logLevel, options = {}) => {
  const { allowClearScreen = true } = options;
  const thresh = LogLevels[logLevel];
  const canClearScreen = allowClearScreen && process.stdout.isTTY && !process.env.CI;
  const clear = canClearScreen ? console.clear : () => {};
  const output = (type, msg, options = {}) => {
    if (thresh >= LogLevels[type]) {
      if (options.clear) clear();
      const split = msg.split("\n");
      for (const message of split) {
        logger[type](message);
      }
    }
  };
  const warnedMessages = new Set();
  return {
    info(msg, opts) {
      output("info", msg, opts);
    },
    warn(msg, opts) {
      output("warn", msg, opts);
    },
    warnOnce(msg, opts) {
      if (warnedMessages.has(msg)) return;
      output("warn", msg, opts);
      warnedMessages.add(msg);
    },
    error(msg, opts) {
      output("error", msg, opts);
    },
    clearScreen(type) {
      if (thresh >= LogLevels[type]) {
        clear();
      }
    },
  };
};

const resolveDefaultOptions = (astroConfig, options) => {
  const srcDir = fileURLToPath(astroConfig.srcDir);
  const outDir = fileURLToPath(astroConfig.outDir);
  let swSrc = options.swSrc;
  if (!swSrc) {
    const defaultSwSrc = resolveEntry(path.join(srcDir, "sw"));
    if (defaultSwSrc) {
      swSrc = defaultSwSrc;
    } else {
      throw new Error("`swSrc` is not defined.");
    }
  }
  console.log(swSrc);
  return {
    globDirectory: outDir,
    dontCacheBustURLsMatching: /_astro\//,
    ...options,
    swSrc,
    swDest: path.join(outDir, options.swDest || "sw.js"),
    manifestTransforms: [
      (manifestEntries) => {
        const manifest = manifestEntries.map((e) => {
          if (e.url === "index.html") {
            e.url = astroConfig.base;
          } else {
            const isDirectoryBuild = astroConfig.build.format === "directory";
            const endIndex = e.url.lastIndexOf(isDirectoryBuild ? "/index.html" : ".html");
            e.url = path.posix.join(astroConfig.base, endIndex > 0 ? e.url.slice(0, endIndex) : e.url);
            if (astroConfig.trailingSlash === "always") e.url += "/";
          }
          return e;
        });
        return {
          manifest,
          warnings: [],
        };
      },
      ...(options.manifestTransforms ?? []),
    ],
  };
};

// const mainPlugin = (ctx)=>{
//     return {
//         name: "@serwist/astro",
//         enforce: "pre",
//         config (config) {
//             ctx.userViteConfig = config;
//             return {
//                 ssr: {
//                     noExternal: []
//                 }
//             };
//         },
//         async configResolved (config) {
//             ctx.viteConfig = config;
//             ctx.userOptions?.integration?.configureOptions?.(config, ctx.userOptions);
//             ctx.options = await resolveOptions(ctx.userOptions, config);
//         }
//     };
// };

const serwist = (userOptions = {}) => {
  let ctx = { userOptions: {} };
  return {
    name: "serwist",
    hooks: {
      "astro:config:setup"({ updateConfig }) {
        // ctx = createContext();
        console.log(ctx.userOptions);
        updateConfig({
          vite: {
            plugins: [serwistVite(ctx.userOptions)],
          },
        });
      },
      "astro:config:done"({ config, logger }) {
        ctx.userOptions = resolveDefaultOptions(config, userOptions);
        // ctx.logger = createLogger(logger, config.vite.logLevel || "info");
      },
      // async "astro:build:done"() {
      //   if (!ctx.options.disable) {
      //     await generateServiceWorker(ctx);
      //   }
      // },
    },
  };
};

// https://astro.build/config
export default defineConfig({
  integrations: [
    serwist({
      globPatterns: ["**/*.{js,css,html,ico,apng,png,avif,jpg,jpeg,jfif,pjpeg,pjp,gif,svg,webp,json,webmanifest}"],
    }),
  ],
});
