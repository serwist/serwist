import path from "node:path";

import type { Asset, Configuration } from "webpack";
import type { ManifestEntry, ManifestTransform } from "@serwist/build";
import type { GenerateSWConfig } from "@serwist/webpack-plugin";

import type {
  NextBuildInfo,
  SharedWorkboxOptionsKeys,
} from "./private-types.js";
import type { PluginOptions } from "./types.js";

export interface ResolveWorkboxCommonOptions {
  sw: string;
  buildExcludes: NonNullable<PluginOptions["buildExcludes"]>;
  manifestEntries: (string | ManifestEntry)[];
  manifestTransforms: ManifestTransform[];
  modifyURLPrefix: Record<string, string>;
  publicPath: NonNullable<Configuration["output"]>["publicPath"];
}

export type WorkboxCommon = Pick<GenerateSWConfig, SharedWorkboxOptionsKeys>;

interface ResolveWorkboxCommonCompleteOptions
  extends ResolveWorkboxCommonOptions,
    Pick<NextBuildInfo, "destDir" | "isDev" | "buildId"> {}

export const resolveWorkboxCommon = ({
  destDir,
  isDev,
  buildId,

  sw,
  buildExcludes,
  manifestEntries,
  manifestTransforms,
  modifyURLPrefix,
  publicPath,
}: ResolveWorkboxCommonCompleteOptions): WorkboxCommon => ({
  swDest: path.join(destDir, sw),
  additionalManifestEntries: isDev ? [] : manifestEntries,
  exclude: [
    ...buildExcludes,
    ({ asset }: { asset: Asset }) => {
      if (
        asset.name.startsWith("server/") ||
        asset.name.match(
          /^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/
        )
      ) {
        return true;
      }
      if (isDev && !asset.name.startsWith("static/runtime/")) {
        return true;
      }
      return false;
    },
  ],
  modifyURLPrefix: {
    ...modifyURLPrefix,
    "/_next/../public/": "/",
  },
  manifestTransforms: [
    ...manifestTransforms,
    async (manifestEntries, compilation) => {
      const manifest = manifestEntries.map((m) => {
        m.url = m.url.replace("/_next//static/image", "/_next/static/image");
        m.url = m.url.replace("/_next//static/media", "/_next/static/media");
        if (m.revision === null) {
          let key = m.url;
          if (typeof publicPath === "string" && key.startsWith(publicPath)) {
            key = m.url.substring(publicPath.length);
          }
          const asset = (compilation as any).assetsInfo.get(key);
          m.revision = asset ? asset.contenthash || buildId : buildId;
        }
        m.url = m.url.replace(/\[/g, "%5B").replace(/\]/g, "%5D");
        return m;
      });
      return { manifest, warnings: [] };
    },
  ],
});
