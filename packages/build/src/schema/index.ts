import type { MethodNames } from "../types.js";
import getManifestOptionsSchema from "./GetManifestOptions.json";
import injectManifestOptionsSchema from "./InjectManifestOptions.json";
import viteInjectManifestOptionsSchema from "./ViteInjectManifestOptions.json";
import webpackInjectManifestOptionsSchema from "./WebpackInjectManifestOptions.json";

export const optionsSchemas = {
  GetManifest: getManifestOptionsSchema,
  InjectManifest: injectManifestOptionsSchema,
  WebpackInjectManifest: webpackInjectManifestOptionsSchema,
  ViteInjectManifest: viteInjectManifestOptionsSchema,
} satisfies Record<MethodNames, unknown>;
