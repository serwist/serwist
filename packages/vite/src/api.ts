import { existsSync } from "node:fs";
import path, { resolve } from "node:path";

import type { OutputBundle } from "rollup";

import { generateWebManifestFile } from "./assets.js";
import { FILE_SW_REGISTER } from "./constants.js";
import type { SerwistViteContext } from "./context.js";
import { generateRegisterDevSw, generateRegisterSw, generateSimpleSwRegister, generateWebManifest } from "./html.js";
import { generateInjectManifest } from "./modules.js";
import type { ExtendManifestEntriesHook, SerwistViteApi } from "./types.js";

export const generateBundle = ({ options, viteConfig, useImportRegister }: SerwistViteContext, bundle?: OutputBundle) => {
  if (options.disable || !bundle) return;

  if (options.manifest) {
    bundle[options.manifestFilename] = {
      type: "asset",
      name: undefined,
      source: generateWebManifestFile(options),
      fileName: options.manifestFilename,
      needsCodeReference: false,
    };
  }

  // if virtual register is requested, do not inject.
  if (options.injectRegister === "auto") options.injectRegister = useImportRegister ? null : "script";

  if (
    (options.injectRegister === "script" || options.injectRegister === "script-defer") &&
    !existsSync(resolve(viteConfig.publicDir, FILE_SW_REGISTER))
  ) {
    bundle[FILE_SW_REGISTER] = {
      type: "asset",
      name: undefined,
      source: generateSimpleSwRegister(options, false),
      fileName: FILE_SW_REGISTER,
      needsCodeReference: false,
    };
  }
  return bundle;
};

export const createApi = (ctx: SerwistViteContext): SerwistViteApi => {
  return {
    get disabled() {
      return ctx?.options?.disable;
    },
    get pwaInDevEnvironment() {
      return ctx?.devEnvironment === true;
    },
    webManifestData() {
      const options = ctx?.options;
      if (!options || options.disable || !options.manifest || (ctx.devEnvironment && !ctx.options.devOptions.enabled)) return undefined;

      let url = options.manifestFilename;
      let manifest: string;
      if (ctx.devEnvironment && ctx.options.devOptions.enabled === true) {
        url = options.manifestFilename;
        manifest = generateWebManifest(options, true);
      } else {
        manifest = generateWebManifest(options, false);
      }

      return {
        href: `${ctx.devEnvironment ? options.base : options.buildBase}${url}`,
        useCredentials: ctx.options.useCredentials,
        toLinkTag() {
          return manifest;
        },
      };
    },
    registerSWData() {
      // we'll return the info only when it is required
      // 1: exclude if not enabled
      const options = ctx?.options;
      if (!options || options.disable || (ctx.devEnvironment && !ctx.options.devOptions.enabled)) return undefined;

      // 2: if manual registration or using virtual
      const mode = options.injectRegister;
      if (!mode || ctx.useImportRegister) return undefined;

      // 3: otherwise we always return the info
      let type: WorkerType = "classic";
      let script: string | undefined;
      let shouldRegisterSW = options.injectRegister === "inline" || options.injectRegister === "script" || options.injectRegister === "script-defer";
      if (ctx.devEnvironment && ctx.options.devOptions.enabled === true) {
        type = ctx.options.devOptions.type ?? "classic";
        script = generateRegisterDevSw(ctx.options.base);
        shouldRegisterSW = true;
      } else if (shouldRegisterSW) {
        script = generateRegisterSw(options, false);
      }

      const base = ctx.devEnvironment ? options.base : options.buildBase;

      return {
        // hint when required
        shouldRegisterSW,
        inline: options.injectRegister === "inline",
        mode: mode === "auto" ? "script" : mode,
        scope: options.scope,
        inlinePath: path.posix.join(base, options.swUrl),
        registerPath: `${base}${FILE_SW_REGISTER}`,
        type,
        toScriptTag() {
          return script;
        },
      };
    },
    generateBundle(bundle) {
      return generateBundle(ctx, bundle);
    },
    async generateSW() {
      if (ctx.options.disable) {
        return undefined;
      }
      return await generateInjectManifest(ctx.options, ctx.viteConfig);
    },
    extendManifestEntries(fn: ExtendManifestEntriesHook) {
      const { options } = ctx;
      if (options.disable) return;

      const result = fn(options.injectManifest.additionalPrecacheEntries || []);

      if (result != null) {
        options.injectManifest.additionalPrecacheEntries = result;
      }
    },
  };
};
