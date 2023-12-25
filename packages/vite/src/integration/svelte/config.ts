import type { ManifestTransform } from "@serwist/build";

import type { PluginOptions } from "../../types.js";
import type { KitOptions } from "./types.js";

export const configurateSvelteKitOptions = (options: PluginOptions) => {
  // Vite will copy public folder to the globDirectory after pwa plugin runs:
  // globDirectory is the build folder.
  // SvelteKit will copy to the globDirectory before pwa plugin runs (via Vite client build in writeBundle hook):
  // globDirectory is the kit client output folder.
  // We need to disable includeManifestIcons: any icon in the static folder will be twice in the sw's precache manifest.
  if (typeof options.includeManifestIcons === "undefined") options.includeManifestIcons = false;
};

export function createManifestTransform(base: string, webManifestName?: string, options?: KitOptions): ManifestTransform {
  return async (entries) => {
    const defaultAdapterFallback = "prerendered/fallback.html";
    const suffix = options?.trailingSlash === "always" ? "/" : "";
    let adapterFallback = options?.adapterFallback;
    let excludeFallback = false;
    // the fallback will be always generated by SvelteKit.
    // The adapter will copy the fallback only if it is provided in its options: we need to exclude it
    if (!adapterFallback) {
      adapterFallback = defaultAdapterFallback;
      excludeFallback = true;
    }

    // the fallback will be always in .svelte-kit/output/prerendered/fallback.html
    const manifest = entries
      .filter(({ url }) => !(excludeFallback && url === defaultAdapterFallback))
      .map((e) => {
        let url = e.url;
        // client assets in `.svelte-kit/output/client` folder.
        // SSG pages in `.svelte-kit/output/prerendered/pages` folder.
        // fallback page in `.svelte-kit/output/prerendered` folder (fallback.html is the default).
        if (url.startsWith("client/")) url = url.slice(7);
        else if (url.startsWith("prerendered/pages/")) url = url.slice(18);
        else if (url === defaultAdapterFallback) url = adapterFallback!;

        if (url.endsWith(".html")) {
          if (url.startsWith("/")) url = url.slice(1);

          if (url === "index.html") {
            url = base;
          } else {
            const idx = url.lastIndexOf("/");
            if (idx > -1) {
              // abc/index.html -> abc/?
              if (url.endsWith("/index.html")) url = `${url.slice(0, idx)}${suffix}`;
              // abc/def.html -> abc/def/?
              else url = `${url.substring(0, url.lastIndexOf("."))}${suffix}`;
            } else {
              // xxx.html -> xxx/?
              url = `${url.substring(0, url.lastIndexOf("."))}${suffix}`;
            }
          }
        }

        e.url = url;

        return e;
      });

    if (!webManifestName) return { manifest };

    return { manifest: manifest.filter((e) => e.url !== webManifestName) };
  };
}

export function buildGlobPatterns(globPatterns?: string[]) {
  if (globPatterns) {
    if (!globPatterns.some((g) => g.startsWith("prerendered/"))) globPatterns.push("prerendered/**/*.html");

    if (!globPatterns.some((g) => g.startsWith("client/"))) globPatterns.push("client/**/*.{js,css,ico,png,svg,webp,webmanifest}");

    if (!globPatterns.some((g) => g.includes("webmanifest"))) globPatterns.push("client/*.webmanifest");

    return globPatterns;
  }

  return ["client/**/*.{js,css,ico,png,svg,webp,webmanifest}", "prerendered/**/*.html"];
}

export function buildGlobIgnores(globIgnores?: string[]) {
  if (globIgnores) {
    if (!globIgnores.some((g) => g.startsWith("server/"))) globIgnores.push("server/*.*");

    return globIgnores;
  }

  return ["server/*.*"];
}
