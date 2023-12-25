import type { Plugin, UserConfig } from "vite";

import { VIRTUAL_MODULES, VIRTUAL_MODULES_MAP, VIRTUAL_MODULES_RESOLVE_PREFIX } from "../constants.js";
import type { SerwistViteContext } from "../context.js";
import { generateRegisterSw } from "../modules.js";
import { resolveOptions } from "../options.js";
import type { SerwistViteApi } from "../types.js";

export const mainPlugin = (ctx: SerwistViteContext, api: SerwistViteApi) => {
  return <Plugin>{
    name: "@serwist/vite",
    enforce: "pre",
    config() {
      return <UserConfig>{
        ssr: {
          noExternal: [],
        },
      };
    },
    async configResolved(config) {
      ctx.useImportRegister = false;
      ctx.viteConfig = config;
      ctx.userOptions?.integration?.configureOptions?.(config, ctx.userOptions);
      ctx.options = await resolveOptions(ctx.userOptions, config);
    },
    load(id) {
      if (!id.startsWith(VIRTUAL_MODULES_RESOLVE_PREFIX)) {
        return undefined;
      }
      if (VIRTUAL_MODULES.includes(id)) {
        ctx.useImportRegister = true;
        return generateRegisterSw(ctx.options, VIRTUAL_MODULES_MAP[id]);
      }
      return undefined;
    },
    api,
  };
};
