// Source (MIT): https://github.com/rehypejs/rehype-slug
/** @import { Plugin } from "unified" */
/** @import { Root, Nodes } from "hast" */
import Slugger from "github-slugger";
import { hasProperty } from "hast-util-has-property";
import { visit } from "unist-util-visit";
import { getNodeAsString } from "./get-node-as-string.js";

const slugs = new Slugger();

/**
 * Get the rank (`1` to `6`) of headings (`h1` to `h6`).
 *
 * @param {Nodes} node Node to check.
 * @returns {number | undefined} Rank of the heading or `undefined` if not a heading.
 */
const headingRank = (node) => {
  const name = node.type === "element" ? node.tagName.toLowerCase() : "";
  const code =
    name.length === 13 && name.slice(0, 11) === "components." && name.charCodeAt(11) === 104 /* `h` */
      ? name.charCodeAt(12)
      : name.length === 2 && name.charCodeAt(0) === 104 /* `h` */
        ? name.charCodeAt(1)
        : 0;
  return code > 48 /* `0` */ && code < 55 /* `7` */ ? code - 48 /* `0` */ : undefined;
};

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
