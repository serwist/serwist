import crypto from "node:crypto";
import { PUBLIC_CANONICAL_URL } from "$env/static/public";
import type { TwoslashRenderer } from "@shikijs/twoslash";
import { toHtml } from "hast-util-to-html";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { defaultHandlers, toHast } from "mdast-util-to-hast";
import type { ShikiTransformerContextCommon } from "shiki";

const getErrorLevelClass = (error: any) => {
  switch (error.level) {
    case "warning":
      return "twoslash-error-level-warning";
    case "suggestion":
      return "twoslash-error-level-suggestion";
    case "message":
      return "twoslash-error-level-message";
    default:
      return "";
  }
};

const regexType = /^[A-Z][a-zA-Z0-9_]*(\<[^\>]*\>)?:/;
const regexFunction = /^[a-zA-Z0-9_]*\(/;

/**
 * A custom hover info processor derived from `@shikijs/twoslash.defaultHoverInfoProcessor` tailored for the docs.
 *
 * Original source: https://github.com/shikijs/shiki/blob/ccb58331464ff25b25d7385be700a00edce1ad4e/packages/twoslash/src/renderer-rich.ts#L636-L653
 *
 * License: MIT
 */
const hoverInfoProcessor = (type: string) => {
  let content = type
    // Remove leading `(property)` or `(method)` on each line
    .replace(/^\(([\w-]+?)\)\s+/gm, "")
    // Remove the import statement
    .replace(/\nimport .*$/, "")
    // Remove the export statement
    .replace(/\nexport .*$/, "")
    .trim();

  // Add `type` or `function` keyword if needed
  if (content.match(regexType)) content = `type ${content}`;
  else if (content.match(regexFunction)) content = `function ${content}`;

  return content;
};

/**
 * A custom markdown renderer derived from `@shikijs/vitepress-twoslash.renderMarkdown` tailored for the docs.
 *
 * Original source: https://github.com/shikijs/shiki/blob/ccb58331464ff25b25d7385be700a00edce1ad4e/packages/vitepress-twoslash/src/renderer-floating-vue.ts#L153-L190
 *
 * License: MIT
 * @param shiki
 * @param md
 * @returns
 */
const renderMarkdown = (shiki: ShikiTransformerContextCommon, md: string) => {
  const mdast = fromMarkdown(
    md.replace(/{@link ([^}]*)}/g, "$1"), // Replace JSDoc links
    { mdastExtensions: [gfmFromMarkdown()] },
  );

  return (
    toHast(mdast, {
      handlers: {
        code(state, node) {
          const lang = node.lang || "";
          if (lang) {
            return shiki.codeToHast(node.value, {
              ...shiki.options,
              transformers: [],
              lang,
            }).children[0] as any;
          }
          return defaultHandlers.code(state, node);
        },
        inlineCode(state, node) {
          const result = defaultHandlers.inlineCode(state, node);
          result.properties.class = "inline-block font-mono text-neutral-600 dark:text-neutral-400 break-all";
          return result;
        },
        link(state, node) {
          const result = defaultHandlers.link(state, node);
          result.properties.class = "link sm";
          if (typeof result.properties.href === "string" && result.properties.href.startsWith("http")) {
            try {
              const href = new URL(result.properties.href);
              if (href.origin === PUBLIC_CANONICAL_URL) {
                result.properties.href = `${href.pathname}${href.hash}`;
              } else {
                result.properties.target = "_blank";
                result.properties.rel = "noreferrer";
              }
            } catch {
              // Someone may actually mess an URL up.
              // Best to be on the safe side.
            }
          }
          return result;
        },
      },
    }) as any
  ).children;
};

const renderMarkdownInline = (shiki: ShikiTransformerContextCommon, md: string, context?: string) => {
  if (context === "tag:param") {
    md = md.replace(/^([\w$-]+)/, "`$1` ");
  }
  const children = renderMarkdown(shiki, md);
  if (children.length === 1 && children[0].type === "element" && children[0].tagName === "p") {
    return children[0].children;
  }
  return children;
};

/**
 * A custom renderer derived from `@shikijs/twoslash.rendererClassic` tailored for the docs.
 *
 * Original source: https://github.com/shikijs/shiki/blob/ccb58331464ff25b25d7385be700a00edce1ad4e/packages/twoslash/src/renderer-classic.ts
 *
 * License: MIT
 */
export const renderer = (): TwoslashRenderer => {
  return {
    nodeStaticInfo(info, node) {
      if (!info.text) {
        return node;
      }
      const content = hoverInfoProcessor(info.text);
      if (!content || content === "any") {
        return node;
      }
      const result: any[] = [];
      const hastContent = this.codeToHast(content, {
        ...this.options,
        transformers: [],
        lang: this.options.lang === "tsx" || this.options.lang === "jsx" ? "tsx" : "ts",
      });
      result.push({
        type: "element",
        tagName: "div",
        properties: { class: "twoslash-popup-type" },
        children: [((hastContent.children[0] as any).children as any)[0]],
      });
      if (info.docs) {
        result.push({
          type: "element",
          tagName: "div",
          properties: { class: "twoslash-popup-docs" },
          children: renderMarkdown(this, info.docs),
        });
      }
      if (info.tags?.length) {
        result.push({
          type: "element",
          tagName: "div",
          properties: {
            class: "twoslash-popup-docs twoslash-popup-docs-tags",
          },
          children: info.tags.map((tag) => ({
            type: "element",
            tagName: "span",
            properties: {
              class: "twoslash-popup-docs-tag",
            },
            children: [
              {
                type: "element",
                tagName: "span",
                properties: {
                  class: "twoslash-popup-docs-tag-name",
                },
                children: [
                  {
                    type: "text",
                    value: `@${tag[0]}`,
                  },
                ],
              },
              ...(tag[1]
                ? [
                    {
                      type: "element",
                      tagName: "span",
                      properties: {
                        class: "twoslash-popup-docs-tag-value",
                      },
                      children: renderMarkdownInline(this, tag[1], `tag:${tag[0]}`),
                    },
                  ]
                : []),
            ],
          })),
        });
      }

      return {
        type: "element",
        tagName: "data-lsp",
        properties: {
          lsp: toHtml(result),
          tpid: `twoslash-tooltip-${crypto.randomBytes(4).toString("hex")}`,
        },
        children: [node],
      };
    },

    nodesError(error, children) {
      return [
        {
          type: "element",
          tagName: "span",
          properties: {
            class: ["twoslash-error", getErrorLevelClass(error)].filter(Boolean).join(" "),
          },
          children,
        },
      ];
    },

    lineError(error) {
      return [
        {
          type: "element",
          tagName: "div",
          properties: {
            class: `twoslash-meta-line twoslash-error-line ${getErrorLevelClass(error)}`,
          },
          children: [
            {
              type: "text",
              value: error.text,
            },
          ],
        },
      ];
    },

    lineCompletion(query) {
      return [
        {
          type: "element",
          tagName: "div",
          properties: { class: "meta-line" },
          children: [
            { type: "text", value: " ".repeat(query.character) },
            {
              type: "element",
              tagName: "span",
              properties: { class: "inline-completions" },
              children: [
                {
                  type: "element",
                  tagName: "ul",
                  properties: { class: "dropdown" },
                  children: query
                    .completions!.filter((i) => i.name.startsWith(query.completionsPrefix || "____"))
                    .map((i) => ({
                      type: "element",
                      tagName: "li",
                      properties: {
                        class:
                          "kindModifiers" in i && typeof i.kindModifiers === "string" && i.kindModifiers?.split(",").includes("deprecated")
                            ? "deprecated"
                            : undefined,
                      },
                      children: [
                        {
                          type: "element",
                          tagName: "span",
                          properties: {},
                          children: [
                            {
                              type: "element",
                              tagName: "span",
                              properties: { class: "result-found" },
                              children: [
                                {
                                  type: "text",
                                  value: query.completionsPrefix || "",
                                },
                              ],
                            },
                            {
                              type: "text",
                              value: i.name.slice(query.completionsPrefix?.length || 0),
                            },
                          ],
                        },
                      ],
                    })),
                },
              ],
            },
          ],
        },
      ];
    },

    lineQuery(query, targetNode) {
      const targetText = targetNode?.type === "text" ? targetNode.value : "";
      const offset = Math.max(0, (query.character || 0) + Math.floor(targetText.length / 2) - 1);

      return [
        {
          type: "element",
          tagName: "div",
          properties: { class: "meta-line" },
          children: [
            { type: "text", value: " ".repeat(offset) },
            {
              type: "element",
              tagName: "span",
              properties: { class: "popover" },
              children: [
                {
                  type: "element",
                  tagName: "div",
                  properties: { class: "arrow" },
                  children: [],
                },
                {
                  type: "text",
                  value: query.text || "",
                },
              ],
            },
          ],
        },
      ];
    },

    lineCustomTag(tag) {
      return [
        {
          type: "element",
          tagName: "div",
          properties: { class: `meta-line logger ${tag.name}-log` },
          children: [
            {
              type: "element",
              tagName: "span",
              properties: { class: "message" },
              children: [
                {
                  type: "text",
                  value: tag.text || "",
                },
              ],
            },
          ],
        },
      ];
    },
  };
};
