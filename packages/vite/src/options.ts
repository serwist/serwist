import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import type { ResolvedConfig } from "vite";

import { configureStaticAssets } from "./assets.js";
import type { ManifestOptions, PluginOptions, ResolvedPluginOptions } from "./types.js";
import { resolveBasePath, slash } from "./utils.js";

export const resolveOptions = async (options: PluginOptions, viteConfig: ResolvedConfig): Promise<ResolvedPluginOptions> => {
  const root = viteConfig.root;
  const pkg = fs.existsSync("package.json") ? JSON.parse(fs.readFileSync("package.json", "utf-8")) : {};

  const {
    mode = (process.env.NODE_ENV || "production") as "production" | "development",
    injectRegister = "auto",
    registerType = "prompt",
    manifestFilename = "manifest.webmanifest",
    minify = true,
    base = viteConfig.base,
    includeAssets = undefined,
    includeManifestIcons = true,
    useCredentials = false,
    disable = false,
    devOptions = { enabled: false, type: "classic", suppressWarnings: false },
    integration = {},
    buildBase,
    ...injectManifest
  } = options;

  const basePath = resolveBasePath(base);
  // check typescript service worker for injectManifest strategy
  const scope = options.scope || basePath;

  let assetsDir = slash(viteConfig.build.assetsDir ?? "assets");
  if (assetsDir[assetsDir.length - 1] !== "/") assetsDir += "/";

  // remove './' prefix from assetsDir
  const dontCacheBustURLsMatching = new RegExp(`^${assetsDir.replace(/^\.*?\//, "")}`);

  const defaultManifest: Partial<ManifestOptions> = {
    name: pkg.name,
    short_name: pkg.name,
    start_url: basePath,
    display: "standalone",
    background_color: "#ffffff",
    lang: "en",
    scope,
  };

  const manifest = typeof options.manifest === "boolean" && !options.manifest ? false : Object.assign({}, defaultManifest, options.manifest || {});
  const { plugins = [], rollupOptions = {}, rollupFormat = "es", swUrl = "/sw.js", swSrc, swDest, ...userInjectManifest } = injectManifest || {};

  if (!devOptions.enabled || viteConfig.command !== "serve") {
    devOptions.enabled = false;
    devOptions.type = "classic";
  }

  // Convert icons' purpose
  if (manifest) {
    if (manifest.icons) {
      manifest.icons = manifest.icons.map((icon) => {
        if (icon.purpose && Array.isArray(icon.purpose)) icon.purpose = icon.purpose.join(" ");
        return icon;
      });
    }
    if (manifest.shortcuts) {
      manifest.shortcuts.forEach((shortcut) => {
        if (shortcut.icons) {
          shortcut.icons = shortcut.icons.map((icon) => {
            if (icon.purpose && Array.isArray(icon.purpose)) icon.purpose = icon.purpose.join(" ");
            return icon;
          });
        }
      });
    }
  }

  const resolvedPluginOptions = {
    base: basePath,
    mode,
    injectRegister,
    registerType,
    manifestFilename,
    manifest,
    useCredentials,
    injectManifest: {
      dontCacheBustURLsMatching,
      swUrl,
      swSrc: path.resolve(root, swSrc),
      swDest: path.resolve(root, viteConfig.build.outDir, swDest),
      ...userInjectManifest,
    },
    scope,
    minify,
    includeAssets,
    includeManifestIcons,
    disable,
    integration,
    devOptions,
    rollupFormat,
    buildBase: buildBase ?? basePath,
    injectManifestRollupOptions: {
      plugins,
      rollupOptions,
      format: rollupFormat,
    },
  } satisfies ResolvedPluginOptions;

  // calculate hash only when required
  const calculateHash =
    !resolvedPluginOptions.disable &&
    (resolvedPluginOptions.manifest || resolvedPluginOptions.includeAssets) &&
    (viteConfig.command === "build" || resolvedPluginOptions.devOptions.enabled);

  if (calculateHash) await configureStaticAssets(resolvedPluginOptions, viteConfig);

  return resolvedPluginOptions;
};
