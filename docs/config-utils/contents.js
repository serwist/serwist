/** @import { List, ListItem, PhrasingContent } from "mdast"; */
/** @import { ContentsOptions, SearchEntry } from "./types.js"; */
/**
 * Insert an entry into `parent`.
 *
 * @param {SearchEntry} entry
 * @param {List | ListItem} parent
 * @param {ContentsOptions} settings
 */
const insert = (entry, parent, settings) => {
  let index = -1;
  const tail = parent.children[parent.children.length - 1];

  if (parent.type === "list") {
    if (entry.depth === 1) {
      parent.children.push({
        type: "listItem",
        spread: false,
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                title: null,
                url: `#${entry.id}`,
                children: all(entry.children),
              },
            ],
          },
        ],
      });
    } else if (parent.children.length > 0) {
      const tail = parent.children[parent.children.length - 1];
      insert(entry, tail, settings);
    } else {
      const item = /** @type {ListItem} */ ({ type: "listItem", spread: false, children: [] });
      parent.children.push(item);
      insert(entry, item, settings);
    }
  }
  // List item
  else if (tail && tail.type === "list") {
    entry.depth--;
    insert(entry, tail, settings);
  } else {
    const item = /** @type {List} */ ({
      type: "list",
      ordered: settings.ordered,
      spread: false,
      children: [],
    });
    parent.children.push(item);
    entry.depth--;
    insert(entry, item, settings);
  }

  if (parent.type === "list" && !settings.tight) {
    parent.spread = false;

    while (++index < parent.children.length) {
      if (parent.children[index].children.length > 1) {
        parent.spread = true;
        break;
      }
    }
  } else {
    parent.spread = !settings.tight;
  }
};

/**
 * @param {PhrasingContent[]} [nodes]
 * @returns
 */
const all = (nodes) => {
  let result = /** @type {PhrasingContent[]} */ ([]);
  let index = -1;

  if (nodes) {
    while (++index < nodes.length) {
      result = result.concat(one(nodes[index]));
    }
  }

  return result;
};

/**
 * @param {PhrasingContent} node
 * @returns {PhrasingContent | PhrasingContent[]}
 */
const one = (node) => {
  if (node.type === "footnoteReference") {
    return [];
  }

  if (node.type === "link" || node.type === "linkReference") {
    return all(node.children);
  }

  if ("children" in node) {
    const { children, position, ...copy } = node;
    return Object.assign(structuredClone(copy), {
      children: all(node.children),
    });
  }

  const { position, ...copy } = node;
  return structuredClone(copy);
};

/**
 * Transform a list of heading objects to a markdown list.
 *
 * @param {SearchEntry[]} map
 * @param {ContentsOptions} settings
 */
export const contents = (map, settings) => {
  const { ordered = false, tight = false } = settings;
  const table = /** @type {List} */ ({ type: "list", ordered, spread: false, children: [] });
  let minDepth = Number.POSITIVE_INFINITY;
  let index = -1;

  // Find minimum depth.
  while (++index < map.length) {
    if (map[index].depth < minDepth) {
      minDepth = map[index].depth;
    }
  }

  // Normalize depth.
  index = -1;

  while (++index < map.length) {
    map[index].depth -= minDepth - 1;
  }

  // Add TOC to list.
  index = -1;

  while (++index < map.length) {
    insert(map[index], table, { ordered, tight });
  }

  return table;
};
