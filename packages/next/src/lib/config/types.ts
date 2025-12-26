import type { BuildOptions } from "@serwist/cli";
import type { Optional } from "@serwist/utils";

export interface SerwistOptions extends Optional<BuildOptions, "globDirectory"> {
  /**
   * Whether Serwist should precache prerendered routes.
   * 
   * @default true
   */
  precachePrerendered?: boolean;
}