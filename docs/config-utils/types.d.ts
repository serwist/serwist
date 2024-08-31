import type { RootContent, Heading, PhrasingContent, Root, List } from "mdast";
import type { Test } from "unist-util-is";

export type Rank = Heading["depth"];
export type Node = Root | RootContent;

/**
 * Search configuration.
 */
export interface SearchOptions {
  /**
   * Maximum heading depth to include in the table of contents.
   *
   * This is inclusive: when set to `3`, level three headings are included
   * (those with three hashes, `###`).
   */
  maxDepth?: Rank;
  /**
   * Headings to skip, wrapped in `new RegExp('^(' + value + ')$', 'i')`.
   *
   * Any heading matching this expression will not be present in the table of
   * contents.
   */
  skip?: string;
  /**
   * Allow headings to be children of certain node types (default: the to `toc`
   * given `tree`, to only allow top-level headings).
   *
   * Internally, uses `unist-util-is` to check, so `parents` can be any
   * `is`-compatible test.
   */
  parents?: Test;
}

export interface SearchEntry {
  id: string;
  children: PhrasingContent[];
  depth: Rank;
}

export interface SearchResult {
  index: number;
  endIndex: number;
  map: SearchEntry[];
}

/**
 * Build configuration.
 */
export interface ContentsOptions {
  /**
   * Whether to compile list items tightly.
   */
  tight?: boolean;
  /**
   * Whether to compile list items as an ordered list, otherwise they are
   * unordered.
   */
  ordered?: boolean;
}

export interface ExtraOptions {
  /**
   * Heading to look for, wrapped in `new RegExp('^(' + value + ')$', 'i')`.
   */
  heading?: string | null;
}

export type Options = SearchOptions & ContentsOptions & ExtraOptions;

export interface TocResult {
  /**
   * Index of the node right after the table of contents heading, `-1` if no
   * heading was found, `null` if no `heading` was given.
   */
  index: number | null;
  /**
   *  Index of the first node after `heading` that is not part of its section,
   *  `-1` if no heading was found, `null` if no `heading` was given, same as
   *  `index` if there are no nodes between `heading` and the first heading in
   *  the table of contents.
   */
  endIndex: number | null;
  /**
   * List representing the generated table of contents, `null` if no table of
   * contents could be created, either because no heading was found or because
   * no following headings were found.
   */
  map: List | null;
}
