export const FILE_SW_REGISTER = "register-sw.js";

export const VIRTUAL_MODULES_RESOLVE_PREFIX = "\0/@serwist/vite/";
export const INTERNAL_SERWIST_VIRTUAL = "virtual:internal-serwist";
export const RESOLVED_INTERNAL_SERWIST_VIRTUAL = `\0${INTERNAL_SERWIST_VIRTUAL}`;

export const PWA_INFO_VIRTUAL = "virtual:pwa-info";
export const RESOLVED_PWA_INFO_VIRTUAL = `\0${PWA_INFO_VIRTUAL}`;

export const DEV_SW_NAME = "dev-sw.js?dev-sw";
export const DEV_SW_VIRTUAL = `${VIRTUAL_MODULES_RESOLVE_PREFIX}pwa-entry-point-loaded`;
export const RESOLVED_DEV_SW_VIRTUAL = `\0${DEV_SW_VIRTUAL}`;
export const DEV_READY_NAME = "vite-pwa-plugin:dev-ready";
export const DEV_REGISTER_SW_NAME = "vite-plugin-pwa:register-sw";
