import type { KitConfig } from "@sveltejs/kit";

import type { PluginOptions as BasePluginOptions } from "../../types.js";
import type { Optional } from "../../utils-types.js";

export interface KitOptions extends Pick<KitConfig, "appDir" | "files"> {
  /**
   * @see https://kit.svelte.dev/docs/adapter-static#options-fallback
   */
  adapterFallback?: string;
  /**
   * `trailingSlash` in `+page.{ts,js}` or `+layout.{ts,js}` files.
   * @default "never"
   */
  trailingSlash?: "never" | "always" | "ignore";
  /**
   * Should `"${appDir}/version.json"` be included in the service worker's precache manifest?
   *
   * @default false
   */
  includeVersionFile?: boolean;
}

export interface PluginOptions extends Optional<Omit<BasePluginOptions, "swSrc" | "swDest" | "swUrl">, "globDirectory"> {
  kit?: KitOptions;
}
