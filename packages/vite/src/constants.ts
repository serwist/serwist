export const FILE_SW_REGISTER = "registerSW.js";

export const VIRTUAL_MODULES_MAP: Record<string, string> = {
  "@serwist/vite/virtual-register": "register",
  "@serwist/vite/virtual-vue": "vue",
  "@serwist/vite/virtual-svelte": "svelte",
  "@serwist/vite/virtual-react": "react",
  "@serwist/vite/virtual-preact": "preact",
  "@serwist/vite/virtual-solid": "solid",
};
export const VIRTUAL_MODULES_RESOLVE_PREFIX = "@serwist/vite/virtual-";
export const VIRTUAL_MODULES = Object.keys(VIRTUAL_MODULES_MAP);

export const PWA_INFO_VIRTUAL = "virtual:pwa-info";
export const RESOLVED_PWA_INFO_VIRTUAL = `\0${PWA_INFO_VIRTUAL}`;

export const DEV_SW_NAME = "dev-sw.js?dev-sw";
export const DEV_SW_VIRTUAL = `${VIRTUAL_MODULES_RESOLVE_PREFIX}pwa-entry-point-loaded`;
export const RESOLVED_DEV_SW_VIRTUAL = `\0${DEV_SW_VIRTUAL}`;
export const DEV_READY_NAME = "vite-pwa-plugin:dev-ready";
export const DEV_REGISTER_SW_NAME = "vite-plugin-pwa:register-sw";
