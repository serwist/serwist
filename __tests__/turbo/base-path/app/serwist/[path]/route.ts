import { createSerwistRoute } from "@serwist/turbopack";
import nextConfig from "../../../next.config.mjs";

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  swSrc: "app/sw.ts",
  nextConfig,
});
