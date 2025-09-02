import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import type { Nuxt } from "@nuxt/schema";
import type { ManifestTransform } from "@serwist/build";
import { DEFAULT_GLOB_PATTERNS } from "@serwist/build";
import type { PluginOptions } from "@serwist/vite";
import type { NitroConfig } from "nitropack";

export const configureSerwistOptions = (options: PluginOptions, nuxt: Nuxt, nitroConfig: NitroConfig) => {
  let buildAssetsDir = nuxt.options.app.buildAssetsDir ?? "_nuxt/";
  if (buildAssetsDir[0] === "/") buildAssetsDir = buildAssetsDir.slice(1);
  if (buildAssetsDir[buildAssetsDir.length - 1] !== "/") buildAssetsDir += "/";

  // Vite 5 support: allow override dontCacheBustURLsMatching
  if (!("dontCacheBustURLsMatching" in options)) {
    options.dontCacheBustURLsMatching = new RegExp(buildAssetsDir);
  }

  options.globPatterns = options.globPatterns ?? DEFAULT_GLOB_PATTERNS;

  // Handle `payloadExtraction`.
  if (
    nuxt.options.experimental.payloadExtraction &&
    // Has prerendered routes
    (nuxt.options.nitro.static ||
      (nuxt.options as any)._generate /* TODO(v10): remove in future */ ||
      !!nitroConfig.prerender?.routes?.length ||
      Object.values(nitroConfig.routeRules ?? {}).some((r: any) => r.prerender))
  ) {
    options.globPatterns.push("**/_payload.json");
  }

  // Handle Nuxt's App Manifest
  let appManifestFolder: string | undefined;
  if (nuxt.options.experimental.appManifest) {
    appManifestFolder = `${buildAssetsDir}builds/`;
    options.globPatterns.push(`${appManifestFolder}**/*.json`);
  }

  const _public = nitroConfig.output?.publicDir ?? nuxt.options.nitro?.output?.publicDir;

  const publicDir = _public ? path.resolve(_public) : path.resolve(nuxt.options.rootDir, ".output/public");

  options.swDest = options.swDest
    ? path.isAbsolute(options.swDest)
      ? options.swDest
      : path.resolve(publicDir, options.swDest)
    : path.resolve(publicDir, "sw.js");
  options.globDirectory = options.globDirectory || publicDir;

  // allow override manifestTransforms
  if (!nuxt.options.dev && !options.manifestTransforms) {
    options.manifestTransforms = [createManifestTransform(nuxt.options.app.baseURL ?? "/", publicDir, appManifestFolder)];
  }
};

function createManifestTransform(base: string, publicDir: string, appManifestFolder?: string): ManifestTransform {
  return async (entries) => {
    entries
      .filter((e) => e.url.endsWith(".html"))
      .forEach((e) => {
        const url = e.url.startsWith("/") ? e.url.slice(1) : e.url;
        if (url === "index.html") {
          e.url = base;
        } else {
          const parts = url.split("/");
          parts[parts.length - 1] = parts[parts.length - 1]!.replace(/\.html$/, "");
          e.url = parts.length > 1 ? parts.slice(0, parts.length - 1).join("/") : parts[0]!;
        }
      });

    if (appManifestFolder) {
      // this shouldn't be necessary, since we are using dontCacheBustURLsMatching
      const regExp = /(\/)?[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}\.json$/i;
      // we need to remove the revision from the sw prechaing manifest, UUID is enough:
      // we don't use dontCacheBustURLsMatching, single regex
      entries
        .filter((e) => e.url.startsWith(appManifestFolder) && regExp.test(e.url))
        .forEach((e) => {
          e.revision = null;
        });
      // add revision to latest.json file: we are excluding `_nuxt/` assets from dontCacheBustURLsMatching
      const latest = `${appManifestFolder}latest.json`;
      const latestJson = path.resolve(publicDir, latest);
      const data = await fsp.lstat(latestJson).catch(() => undefined);
      if (data?.isFile()) {
        const revision = await new Promise<string>((resolve, reject) => {
          const cHash = createHash("MD5");
          const stream = createReadStream(latestJson);
          stream.on("error", (err) => {
            reject(err);
          });
          stream.on("data", (chunk) => cHash.update(chunk));
          stream.on("end", () => {
            resolve(cHash.digest("hex"));
          });
        });

        const latestEntry = entries.find((e) => e.url === latest);
        if (latestEntry) latestEntry.revision = revision;
        else entries.push({ url: latest, revision, size: data.size });
      } else {
        entries = entries.filter((e) => e.url !== latest);
      }
    }

    return { manifest: entries, warnings: [] };
  };
}
