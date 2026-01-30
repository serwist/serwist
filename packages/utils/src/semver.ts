// Source: https://github.com/browserslist/browserslist/blob/5cad191bc1a1e5beb7768ca263503cc15d0dcc7d/index.js#L139-L151
// License: MIT
import { compare } from "./compare.js";

export const compareSemver = (a: string[], b: string[]) => {
  return (
    compare(Number.parseInt(a[0], 10), Number.parseInt(b[0], 10)) ||
    compare(Number.parseInt(a[1] || "0", 10), Number.parseInt(b[1] || "0", 10)) ||
    compare(Number.parseInt(a[2] || "0", 10), Number.parseInt(b[2] || "0", 10))
  );
};
