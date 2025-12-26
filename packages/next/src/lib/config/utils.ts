import browserslist from "browserslist";
import { MODERN_BROWSERSLIST_TARGET } from "next/constants.js";
import { SUPPORTED_ESBUILD_TARGETS, UNSUPPORTED_BROWSERLIST_TARGETS } from "./constants.js";

export const generateGlobPatterns = (distDir: string) => [
  `${distDir}static/**/*.{js,css,html,ico,apng,png,avif,jpg,jpeg,jfif,pjpeg,pjp,gif,svg,webp,json,webmanifest}`,
  "public/**/*",
];

// Source: https://github.com/browserslist/browserslist/blob/5cad191bc1a1e5beb7768ca263503cc15d0dcc7d/index.js#L139-L151
// License: MIT
const compare = <T extends string | number>(a: T, b: T) => {
  if (a < b) return -1;
  if (a > b) return +1;
  return 0;
};
const compareSemver = (a: string[], b: string[]) => {
  return (
    compare(Number.parseInt(a[0], 10), Number.parseInt(b[0], 10)) ||
    compare(Number.parseInt(a[1] || "0", 10), Number.parseInt(b[1] || "0", 10)) ||
    compare(Number.parseInt(a[2] || "0", 10), Number.parseInt(b[2] || "0", 10))
  );
};

// Original: https://github.com/marcofugaro/browserslist-to-esbuild/blob/0875f1a4ec71f206a634ba406c3528ca5ecf04de/src/index.js
// License: MIT
/**
 * Loads and converts Browserslist into esbuild's `target` option.
 * 
 * @param cwd 
 * @returns 
 */
export const loadBrowserslist = async (cwd: string): Promise<string[]> => {
  const browserslistConfig = browserslist.loadConfig({ path: cwd }) ?? MODERN_BROWSERSLIST_TARGET;
  return (
    browserslist(browserslistConfig)
      // Filter out legacy Android webview to avoid converting them into Chrome targets 
      .filter(query => !UNSUPPORTED_BROWSERLIST_TARGETS.some(target => query.startsWith(target)))
      .map((query) => {
        const modified = query === "safari TP" ? browserslist("last 1 safari version")[0] : query;
        const split = modified.split(" ");
        // https://github.com/browserslist/browserslist/blob/5cad191bc1a1e5beb7768ca263503cc15d0dcc7d/README.md?plain=1#L329-L350
        // https://esbuild.github.io/api/#target
        if (split[0] === "android" || split[0] === "and_chr") {
          split[0] = "chrome";
        }
        if (split[0] === "and_ff") {
          split[0] = "firefox";
        }
        if (split[0] === "ios_saf" || split[0] === "ios") {
          split[0] = "safari";
        }
        // Remove upper version bound
        if (split[1].includes("-")) {
          split[1] = split[1].slice(0, split[1].indexOf("-"));
        }
        // Trim ending .0
        if (split[1].endsWith(".0")) {
          split[1] = split[1].slice(0, -2);
        }
        return split;
      })
      // Remove unsupported browsers and invalid versions
      .filter((split) => SUPPORTED_ESBUILD_TARGETS.includes(split[0]) && /^\d+(\.\d+)*$/.test(split[1]))
      // Re-sort the result such that the oldest versions end up the latest, same as how
      // Browserslist does it.
      .sort((a, b) => {
        if (a[0] === b[0]) {
          return compareSemver(b[1].split("."), a[1].split("."));
        } else {
          return compare(a[0], b[0]);
        }
      })
      // Only pick the oldest included version for each browser to avoid duplications.
      .reduce((acc, browser) => {
        const existingIndex = acc.findIndex((br) => br[0] === browser[0]);
        if (existingIndex !== -1) {
          acc[existingIndex][1] = browser[1];
        } else {
          acc.push(browser);
        }
        return acc;
      }, [] as string[][])
      .map((split) => split.join(""))
  );
};
