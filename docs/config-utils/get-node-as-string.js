import { toString as mdastToString } from "mdast-util-to-string";

/**
 * @param {unknown} node 
 * @returns 
 */
export const getNodeAsString = (node) =>
  mdastToString(node, { includeImageAlt: false });