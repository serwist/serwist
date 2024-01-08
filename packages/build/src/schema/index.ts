import type { MethodNames } from "../types.js";
import getManifestOptionsSchema from "./GetManifestOptions.json";
import injectManifestOptionsSchema from "./InjectManifestOptions.json";
import webpackInjectManifestOptionsSchema from "./WebpackInjectManifestOptions.json";
import viteInjectManifestOptionsSchema from "./ViteInjectManifestOptions.json";

export const optionsSchemas = {
  GetManifest: getManifestOptionsSchema,
  InjectManifest: injectManifestOptionsSchema,
  WebpackInjectManifest: webpackInjectManifestOptionsSchema,
  ViteInjectManifest: viteInjectManifestOptionsSchema,
} satisfies Record<MethodNames, unknown>;
