export const toUnix = (p: string) => p.replace(/\\/g, "/").replace(/(?<!^)\/+/g, "/");
