import crypto from "node:crypto";
import fs from "node:fs";
import { resolve as resolveFs } from "node:path";

import type { InjectManifestOptions, ManifestEntry } from "@serwist/build";
import fg from "fast-glob";
import type { ResolvedConfig } from "vite";

import type { ResolvedPluginOptions } from "./types.js";

const buildManifestEntry = (publicDir: string, url: string): Promise<ManifestEntry> => {
  return new Promise((resolve, reject) => {
    const cHash = crypto.createHash("MD5");
    const stream = fs.createReadStream(resolveFs(publicDir, url));
    stream.on("error", (err) => {
      reject(err);
    });
    stream.on("data", (chunk) => {
      cHash.update(chunk);
    });
    stream.on("end", () => {
      return resolve({
        url,
        revision: `${cHash.digest("hex")}`,
      });
    });
  });
};

const lookupAdditionalPrecacheEntries = (serwistOptions: Partial<InjectManifestOptions>): (string | ManifestEntry)[] => {
  return serwistOptions.additionalPrecacheEntries || [];
};

// we need to make icons relative, we can have for example icon entries with: /pwa.png
// fast-glob will not resolve absolute paths
const normalizeIconPath = (path: string) => {
  return path.startsWith("/") ? path.substring(1) : path;
};

const includeIcons = (icons: Record<string, any>[], globs: string[]) => {
  Object.keys(icons).forEach((key) => {
    const icon = icons[key as any];
    const src = normalizeIconPath(icon.src as string);
    if (!globs.includes(src)) globs.push(src);
  });
};

export const configureStaticAssets = async (resolvedPluginOptions: ResolvedPluginOptions, viteConfig: ResolvedConfig) => {
  const { manifest, injectManifest, includeAssets, includeManifestIcons } = resolvedPluginOptions;

  const { publicDir } = viteConfig;
  const globs: string[] = [];
  const manifestEntries: (string | ManifestEntry)[] = lookupAdditionalPrecacheEntries(injectManifest);
  if (includeAssets) {
    // we need to make icons relative, we can have for example icon entries with: /pwa.png
    // fast-glob will not resolve absolute paths
    if (Array.isArray(includeAssets)) globs.push(...includeAssets.map(normalizeIconPath));
    else globs.push(normalizeIconPath(includeAssets));
  }
  if (includeManifestIcons && manifest) {
    manifest.icons && includeIcons(manifest.icons, globs);
    manifest.shortcuts &&
      manifest.shortcuts.forEach((s) => {
        s.icons && includeIcons(s.icons, globs);
      });
  }
  if (globs.length > 0) {
    let assets = await fg(globs, {
      cwd: publicDir,
      onlyFiles: true,
      unique: true,
    });
    // we also need to remove from the list existing included by the user
    if (manifestEntries.length > 0) {
      const included = manifestEntries.map((me) => {
        if (typeof me === "string") return me;
        else return me.url;
      });
      assets = assets.filter((a) => !included.includes(a));
    }
    const assetsEntries = await Promise.all(
      assets.map((a) => {
        return buildManifestEntry(publicDir, a);
      })
    );
    manifestEntries.push(...assetsEntries);
  }
  if (manifestEntries.length > 0) {
    injectManifest.additionalPrecacheEntries = manifestEntries;
  }
};

export const generateWebManifestFile = (options: ResolvedPluginOptions): string => {
  return `${JSON.stringify(options.manifest, null, options.minify ? 0 : 2)}\n`;
};
