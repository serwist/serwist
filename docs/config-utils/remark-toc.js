// Source (MIT): https://github.com/syntax-tree/mdast-util-toc
/** @import { Transformer } from "unified" */
/** @import { Options } from "./types.js"; */
import { contents } from "./contents.js";
import { search } from "./search.js";
import { toExpression } from "./to-expression.js";

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
