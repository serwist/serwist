import type { Plugin } from "vite";

import { PWA_INFO_VIRTUAL, RESOLVED_PWA_INFO_VIRTUAL } from "../constants.js";
import type { SerwistViteContext } from "../context.js";
import type { SerwistViteApi } from "../types.js";

export const infoPlugin = (ctx: SerwistViteContext, api: SerwistViteApi) => {
  return <Plugin>{
    name: "@serwist/vite:info",
    enforce: "post",
    resolveId(id) {
      if (id === PWA_INFO_VIRTUAL) {
        return RESOLVED_PWA_INFO_VIRTUAL;
      }
      return undefined;
    },
    load(id) {
      if (id === RESOLVED_PWA_INFO_VIRTUAL) {
        return generatePwaInfo(ctx, api);
      }
      return undefined;
    },
  };
};

// see info.d.ts on root
interface VirtualPWAInfo {
  pwaInDevEnvironment: boolean;
  webManifest: {
    href: string;
    useCredentials: boolean;
    linkTag: string;
  };
  registerSW?: {
    mode: "inline" | "script" | "script-defer";
    inlinePath: string;
    registerPath: string;
    scope: string;
    type: "classic" | "module";
    scriptTag?: string;
  };
}

const generatePwaInfo = (_: SerwistViteContext, api: SerwistViteApi) => {
  const webManifestData = api.webManifestData();
  if (!webManifestData) return "export const pwaInfo = undefined;";

  const { href, useCredentials, toLinkTag } = webManifestData;
  const registerSWData = api.registerSWData();

  const entry: VirtualPWAInfo = {
    pwaInDevEnvironment: api.pwaInDevEnvironment,
    webManifest: {
      href,
      useCredentials,
      linkTag: toLinkTag(),
    },
  };

  if (registerSWData) {
    const scriptTag = registerSWData.toScriptTag();
    if (scriptTag) {
      const { mode, inlinePath, registerPath, type, scope } = registerSWData;
      entry.registerSW = {
        mode,
        inlinePath,
        registerPath,
        type,
        scope,
        scriptTag,
      };
    }
  }

  return `export const pwaInfo = ${JSON.stringify(entry)};`;
};
