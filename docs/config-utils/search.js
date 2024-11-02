/** @import { Heading } from "mdast"; */
/** @import { Node, SearchEntry, SearchOptions, SearchResult } from "./types.js"; */
import Slugger from "github-slugger";
import { convert } from "unist-util-is";
import { visit } from "unist-util-visit";
import { getNodeAsString } from "./get-node-as-string.js";
import { toExpression } from "./to-expression.js";

const slugs = new Slugger();

/**
 * Search a node for a ToC.
 *
 * @param {Node} root
 * @param {RegExp | undefined} expression
 * @param {SearchOptions} settings
 * @returns {SearchResult}
 */
export const search = (root, expression, settings) => {
  const skip = settings.skip ? toExpression(settings.skip) : undefined;
  const parents = convert(settings.parents || ((d) => d === root));
  const map = /** @type {SearchEntry[]} */ ([]);
  /** @type {number | undefined} */
  let index;
  /** @type {number | undefined} */
  let endIndex;
  /** @type {Heading | undefined} */
  let opening;

  slugs.reset();

  // Visit all headings in `root`.  We `slug` all headings (to account for
  // duplicates), but only create a TOC from top-level headings (by default).
  visit(root, "heading", (node, position, parent) => {
    const value = getNodeAsString(node);
    /** @type {string} */
    // @ts-expect-error God knows
    const id = node.data?.hProperties?.id;
    const slug = slugs.slug(id || value);

    if (!parents(parent)) {
      return;
    }

    // Our opening heading.
    if (position && expression && !index && expression.test(value)) {
      index = position + 1;
      opening = node;
      return;
    }

    // Our closing heading.
    if (position !== null && opening && !endIndex && node.depth <= opening.depth) {
      endIndex = position;
    }

    // A heading after the closing (if we were looking for one).
    if ((endIndex || !expression) && (!settings.maxDepth || node.depth <= settings.maxDepth) && (!skip || !skip.test(value))) {
      map.push({ depth: node.depth, children: node.children, id: slug });
    }
  });

  return {
    index: index === undefined ? -1 : index,
    endIndex: index === undefined ? -1 : endIndex || /** @type {*} */ (root).children.length,
    map,
  };
};
