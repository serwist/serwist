import type { RuntimeCaching } from "@serwist/sw";
import { nonNullable } from "@serwist/utils";

export interface PageRuntimeCaching extends Omit<RuntimeCaching, "options"> {
  options?: Omit<NonNullable<RuntimeCaching["options"]>, "cacheName">;
}

export interface DefinePageRuntimeCachingOptions {
  rscPrefetch?: PageRuntimeCaching;
  rsc?: PageRuntimeCaching;
  html?: PageRuntimeCaching;
}

/**
 * Conveniently define three `runtimeCaching` entries for Next.js pages.
 * @param options
 * @returns 
 */
export const definePageRuntimeCaching = ({ rscPrefetch, rsc, html }: DefinePageRuntimeCachingOptions): RuntimeCaching[] => {
  const pageRcs = [rscPrefetch, rsc, html] as RuntimeCaching[];

  if (pageRcs[0]) {
    if (!pageRcs[0].options) pageRcs[0].options = {};
    pageRcs[0].options.cacheName = "pages-rsc-prefetch";
  }
  if (pageRcs[1]) {
    if (!pageRcs[1].options) pageRcs[1].options = {};
    pageRcs[1].options.cacheName = "pages-rsc";
  }
  if (pageRcs[2]) {
    if (!pageRcs[2].options) pageRcs[2].options = {};
    pageRcs[2].options.cacheName = "pages";
  }

  return pageRcs.filter(nonNullable);
};
