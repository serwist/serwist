import path from "node:path";

import type { InjectManifestOptions } from "@serwist/build";
import type { Plugin } from "vite";

import type { SerwistViteContext } from "../../context.js";
import { loadSerwistBuild } from "../../modules.js";
import type { SerwistViteApi } from "../../types.js";
import { buildGlobIgnores, buildGlobPatterns, createManifestTransform } from "./config.js";
import type { KitOptions } from "./types.js";

export function serwistSvelte(kit: KitOptions, ctx: SerwistViteContext, api: SerwistViteApi) {
  return <Plugin>{
    name: "@serwist/vite/integration-svelte:build",
    apply: "build",
    enforce: "pre",
    generateBundle(_, bundle) {
      // Generate only for client
      if (ctx.viteConfig.build.ssr) return;

      api.generateBundle(bundle);
    },
    closeBundle: {
      sequential: true,
      enforce: "pre",
      async handler() {
        if (api && !api.disabled && ctx.viteConfig.build.ssr) {
          const clientOutDir = path.resolve(ctx.viteConfig.root, ctx.viteConfig.build.outDir, "../client");
          // SvelteKit's outDir is `.svelte-kit/output/client`.
          // We need to include the parent folder in globDirectory since SvelteKit will generate SSG in `.svelte-kit/output/prerendered` folder.
          const {
            globDirectory = path.resolve(clientOutDir, ".."),
            manifestTransforms = [createManifestTransform(ctx.viteConfig.base, undefined, kit)],
            swSrc,
            swDest,
            ...userInjectManifest
          } = ctx.options.injectManifest;

          // Kit fixes the service worker's name to 'service-worker.js'
          const injectManifestOptions = {
            globDirectory,
            manifestTransforms,
            swSrc: path.resolve(clientOutDir, "service-worker.js"),
            swDest: path.resolve(clientOutDir, "service-worker.js"),
            ...userInjectManifest,
          } satisfies InjectManifestOptions;

          let buildAssetsDir = kit.appDir ?? "_app/";
          if (buildAssetsDir[0] === "/") buildAssetsDir = buildAssetsDir.slice(1);
          if (buildAssetsDir[buildAssetsDir.length - 1] !== "/") buildAssetsDir += "/";

          if (!injectManifestOptions.modifyURLPrefix) {
            injectManifestOptions.globPatterns = buildGlobPatterns(injectManifestOptions.globPatterns);
            if (kit.includeVersionFile) {
              injectManifestOptions.globPatterns.push(`client/${buildAssetsDir}version.json`);
            }
          }

          // Exclude server assets: sw is built on SSR build
          injectManifestOptions.globIgnores = buildGlobIgnores(injectManifestOptions.globIgnores);

          // Vite 5 support: allow override dontCacheBustURLsMatching
          if (!("dontCacheBustURLsMatching" in injectManifestOptions)) {
            injectManifestOptions.dontCacheBustURLsMatching = new RegExp(`${buildAssetsDir}immutable/`);
          }

          const [injectManifest, logSerwistResult] = await Promise.all([
            loadSerwistBuild().then((m) => m.injectManifest),
            import("./log.js").then((m) => m.logSerwistResult),
          ]);

          // Inject the manifest
          const buildResult = await injectManifest(injectManifestOptions);
          // Log workbox result
          logSerwistResult(buildResult, ctx.viteConfig);
        }
      },
    },
  };
}
