import type { InjectManifestOptions } from "@serwist/build";
import type { ModuleFormat } from "rolldown";

export interface PluginOptions extends InjectManifestOptions {
  outputFormat?: ModuleFormat;
}
