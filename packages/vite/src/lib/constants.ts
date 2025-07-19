import type { Frameworks, VirtualFrameworks } from "./types.js";
export const FRAMEWORKS = ["/preact", "/react", "/solid", ".svelte", "/vue"] as const;
export const VIRTUAL_PREFIX = "\0";
export const VIRTUAL_SERWIST = "virtual:serwist";
export const VIRTUAL_SERWIST_RESOLVED = `${VIRTUAL_PREFIX}${VIRTUAL_SERWIST}`;
export const VIRTUAL_FRAMEWORKS_MAP = FRAMEWORKS.reduce(
  (prev, cur) => {
    prev[`${VIRTUAL_PREFIX}${VIRTUAL_SERWIST}${cur}`] = cur;
    return prev;
  },
  {} as Record<VirtualFrameworks, Frameworks>,
);
