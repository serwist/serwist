/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

export interface InstallResult {
  updatedURLs: string[];
  notUpdatedURLs: string[];
}

export interface CleanupResult {
  deletedCacheRequests: string[];
}

export declare interface PrecacheEntry {
  integrity?: string;
  url: string;
  revision?: string | null;
}

export interface PrecacheRouteOptions {
  /**
   * The `directoryIndex` will check cache entries for a URL ending with '/'
   * to see if there is a hit when appending the `directoryIndex` value.
   */
  directoryIndex?: string | null;
  /**
   * An array of RegExp's to remove search params when looking for a cache match.
   */
  ignoreURLParametersMatching?: RegExp[];
  /**
   * The `cleanURLs` option will check the cache for the URL with a `.html` added
   * to the end of the end.
   */
  cleanURLs?: boolean;
  /**
   * This is a function that should take a URL and return an array of
   * alternative URLs that should be checked for precache matches.
   */
  urlManipulation?: UrlManipulation;
}

export type UrlManipulation = ({ url }: { url: URL }) => URL[];
