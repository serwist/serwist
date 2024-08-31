// Source (MIT): https://github.com/syntax-tree/mdast-util-toc
// Source (MIT): https://github.com/rehypejs/rehype-slug
/** @import { Plugin, Transformer } from "unified" */
/** @import { Root } from "hast" */
/** @import { Node, Options } from "./types.js"; */
import Slugger from "github-slugger";
import { hasProperty } from "hast-util-has-property";
import { headingRank } from "hast-util-heading-rank";
import { visit } from "unist-util-visit";
import { contents } from "./contents.js";
import { getNodeAsString } from "./get-node-as-string.js";
import { search } from "./search.js";
import { toExpression } from "./to-expression.js";

/**
 * Generate a table of contents from `tree`.
 *
 * Looks for the first heading matching `options.heading` (case insensitive) and
 * returns a table of contents (a list) for all following headings.
 * If no `heading` is specified, creates a table of contents for all headings in
 * `tree`.
 * `tree` is not changed.
 *
 * Links in the list to headings are based on GitHub’s style.
 * Only top-level headings (those not in blockquotes or lists), are used.
 * This default behavior can be changed by passing `options.parents`.
 *
 * @param {Node} tree
 * @param {Options} [options]
 * @returns {TocResult}
 */
// export const toc = (tree, options = {}) => {
//   const heading = options.heading ? toExpression(options.heading) : undefined;

//   const result = search(tree, heading, options);

//   return {
//     index: heading ? result.index : null,
//     endIndex: heading ? result.endIndex : null,
//     map: result.map.length > 0 ? contents(result.map, options) : null,
//   };
// };

/**
 * @param {Options} [options]
 */
export const remarkToc = (options = {}) => {
  const heading = options.heading ? toExpression(options.heading) : undefined;

  /** @type {Transformer<any>} */
  return (node, vFile) => {
    const result = search(node, heading, options);

    if (!vFile.data.fm) vFile.data.fm = {};

    /** @type {*} */ (vFile.data.fm).headings = result.map.length > 0 ? contents(result.map, options) : null;
  };
};

const slugs = new Slugger();

/**
 * Plugin to add `id`s to headings.
 *
 * @type {Plugin}
 */
export const rehypeSlug = () => {
  return (tree) => {
    slugs.reset();

    visit(/** @type {Root} */ (tree), "element", (node) => {
      if (headingRank(node) && node.properties && !hasProperty(node, "id")) {
        node.properties.id = slugs.slug(getNodeAsString(node));
      }
    });
  };
};
