export const slash = (str: string) => {
  return str.replace(/\\/g, "/");
};

export const toUnix = (p: string) => {
  return slash(p).replace(/(?<!^)\/+/g, "/");
};

export const resolveBasePath = (base: string) => {
  if (isAbsolute(base)) return base;
  return !base.startsWith("/") && !base.startsWith("./") ? `/${base}` : base;
};

export const isAbsolute = (url: string) => {
  return url.match(/^(?:[a-z]+:)?\/\//i);
};
