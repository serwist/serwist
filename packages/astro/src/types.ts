import type { Optional } from "@serwist/utils";
import type { PluginOptions as VitePluginOptions } from "vite-plugin-serwist";

export interface PluginOptions extends Optional<VitePluginOptions, "swSrc" | "swDest" | "globDirectory"> {}
