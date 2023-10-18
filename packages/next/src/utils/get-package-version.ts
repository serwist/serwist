import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/**
 * Get a package's version
 * @param packageName
 * @returns
 */
export const getPackageVersion = (packageName: string): string | undefined => {
  try {
    return require(`${packageName}/package.json`).version;
  } catch {
    return undefined;
  }
};
