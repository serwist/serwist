// @ts-check
import { serwist } from "@serwist/next/config";

export default await serwist({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});
