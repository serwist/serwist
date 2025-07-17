import { createSerwistRoute } from "@serwist/turbopack";
import path from "node:path";
export const dynamic = "force-static";

export const { generateStaticParams, GET } = createSerwistRoute({
  swSrc: path.join(process.cwd(), "app/sw.ts"),
  globDirectory: path.join(process.cwd(), ".next/static"),
  globPatterns: ["**/*.{js,css,html,ico,apng,png,avif,jpg,jpeg,jfif,pjpeg,pjp,gif,svg,webp,json,webmanifest}"],
  globIgnores: [],
  injectionPoint: "self.__SW_MANIFEST",
  manifestTransforms: [
    (manifestEntries) => {
      const manifest = manifestEntries.map((m) => {
        m.url = `/_next/${m.url}`;
        return m;
      });
      return { manifest, warnings: [] };
    },
  ],
});
