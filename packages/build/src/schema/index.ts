import { MethodNames } from "../types.js";
import generateSWOptionsSchema from "./GenerateSWOptions.json";
import getManifestOptionsSchema from "./GetManifestOptions.json";
import injectManifestOptionsSchema from "./InjectManifestOptions.json";
import webpackGenerateSWOptionsSchema from "./WebpackGenerateSWOptions.json";
import webpackInjectManifestOptionsSchema from "./WebpackInjectManifestOptions.json";

export const optionsSchemas = {
  GenerateSW: generateSWOptionsSchema,
  GetManifest: getManifestOptionsSchema,
  InjectManifest: injectManifestOptionsSchema,
  WebpackGenerateSW: webpackGenerateSWOptionsSchema,
  WebpackInjectManifest: webpackInjectManifestOptionsSchema,
} satisfies Record<MethodNames, unknown>;
