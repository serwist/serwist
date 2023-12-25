import path from "node:path";

export const slash = (str: string) => {
  return str.replace(/\\/g, "/");
};

export const resolveBasePath = (base: string) => {
  if (isAbsolute(base)) return base;
  return !base.startsWith("/") ? path.posix.join("/", base) : base;
};

export const isAbsolute = (url: string) => {
  return url.match(/^(?:[a-z]+:)?\/\//i);
};

export const normalizePath = (path: string) => {
  return path.replace(/\\/g, "/");
};
