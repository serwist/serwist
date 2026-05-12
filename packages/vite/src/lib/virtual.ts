import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { VIRTUAL_FRAMEWORKS_MAP, VIRTUAL_PREFIX, VIRTUAL_SERWIST, VIRTUAL_SERWIST_RESOLVED } from "./constants.js";
import type { VirtualFrameworks } from "./types.js";

const require = createRequire(import.meta.url);

export const resolveVirtualId = (id: string) => {
  if (id.startsWith(VIRTUAL_SERWIST)) {
    return `${VIRTUAL_PREFIX}${id}`;
  }
  return undefined;
};

export const loadVirtual = (id: string, ctx: SerwistViteContext) => {
  if (id === VIRTUAL_SERWIST_RESOLVED) {
    return `import { Serwist } from "@serwist/window";
export const swUrl = "${path.posix.join(ctx.options.base, ctx.options.swUrl)}";
export const swScope = "${ctx.options.scope}";
export const swType = "${ctx.devEnvironment ? "module" : ctx.options.type}";
export const getSerwist = () => {
  if ("serviceWorker" in navigator) {
    return new Serwist(swUrl, { scope: swScope, type: swType });
  }
  return undefined;
}`;
  }
  if (Object.hasOwn(VIRTUAL_FRAMEWORKS_MAP, id)) {
    const framework = VIRTUAL_FRAMEWORKS_MAP[id as VirtualFrameworks];
    const content = readFileSync(path.resolve(require.resolve("vite-plugin-serwist"), `../client/index.${framework}.mjs`), "utf-8");
    return content;
  }
  return undefined;
};
