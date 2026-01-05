import { existsSync } from "node:fs";
import path from "node:path";
import { type InjectManifestOptions, injectManifest } from "@serwist/build";
import type { Optional } from "@serwist/utils";
import type { Adapter } from "@sveltejs/kit";

export interface SerwistOptions extends Optional<Omit<InjectManifestOptions, "swSrc" | "swDest">, "globDirectory"> {}

export const DEFAULT_GLOB_PATTERNS = [
  "client/**/*.{js,css,ico,png,svg,webp,json,webmanifest}",
  "prerendered/pages/**/*.html",
  "prerendered/dependencies/**/__data.json",
];

/**
 * Adapter post-processing a SvelteKit service worker. Accepts another adapter.
 *
 * @param adapter
 * @returns
 */
export const serwist = (adapter?: Adapter, options?: SerwistOptions): Adapter => {
  return {
    ...adapter,
    name: adapter ? `${adapter.name} + @serwist/svelte` : `@serwist/svelte`,
    async adapt(builder) {
      let buildAssetsDir = builder.config.kit.appDir;
      if (buildAssetsDir[0] === "/") {
        buildAssetsDir = buildAssetsDir.slice(1);
      }
      if (buildAssetsDir[buildAssetsDir.length - 1] !== "/") {
        buildAssetsDir += "/";
      }
      const swSrc = path.join(builder.getClientDirectory(), "service-worker.js");
      if (!existsSync(swSrc)) {
        builder.log.warn("Failed to locate service worker.");
      } else {
        const { count, size, warnings } = await injectManifest({
          dontCacheBustURLsMatching: new RegExp(`^client/${buildAssetsDir}immutable/`),
          globDirectory: builder.getBuildDirectory("output"),
          globPatterns: DEFAULT_GLOB_PATTERNS,
          ...options,
          swSrc,
          swDest: swSrc,
          globIgnores: ["server/*.*", "client/service-worker.js", ...(options?.globIgnores ?? [])],
          manifestTransforms: [
            ...(options?.manifestTransforms ?? []),
            // This `manifestTransform` makes the precache manifest valid.
            async (entries) => {
              const manifest = entries.map((e) => {
                // Static assets are in the ".svelte-kit/output/client" directory.
                // Prerender pages are in the ".svelte-kit/output/prerendered/pages" directory.
                // Remove the prefix, but keep the ending slash.
                if (e.url.startsWith("client/")) {
                  e.url = e.url.slice(6);
                } else if (e.url.startsWith("prerendered/pages/")) {
                  e.url = e.url.slice(17);
                } else if (e.url.startsWith("prerendered/dependencies/")) {
                  e.url = e.url.slice(24);
                }

                if (e.url.endsWith(".html")) {
                  // trailingSlash: 'always'
                  // https://kit.svelte.dev/docs/page-options#trailingslash
                  // "/abc/index.html" -> "/abc/"
                  // "/index.html" -> "/"
                  if (e.url.endsWith("/index.html")) {
                    e.url = e.url.slice(0, e.url.lastIndexOf("/") + 1);
                  }
                  // trailingSlash: 'ignored'
                  // trailingSlash: 'never'
                  // https://kit.svelte.dev/docs/page-options#trailingslash
                  // "/xxx.html" -> "/xxx"
                  else {
                    e.url = e.url.substring(0, e.url.lastIndexOf("."));
                  }
                }

                // Finally, prepend `viteConfig.base`.
                // "/path" -> "/base/path"
                // "/" -> "/base/"
                e.url = path.posix.join(builder.config.kit.paths.base, e.url);

                return e;
              });

              return { manifest };
            },
          ],
        });
        builder.log(`Generated service worker with ${count} precache entries (${(size / 1024).toFixed(2)} KiB)`);
        if (warnings && warnings.length > 0) {
          builder.log.warn(warnings.join("\n"));
        }
      }
      return adapter?.adapt(builder);
    },
  };
};
