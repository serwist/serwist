export const toUnix = (p: string) => {
  return p.replace(/\\/g, "/").replace(/(?<!^)\/+/g, "/");
};
