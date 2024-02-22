import type { TwoslashRenderer } from "@shikijs/twoslash";
import { defaultHoverInfoProcessor } from "@shikijs/twoslash";
import { toHtml } from "hast-util-to-html";

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
      const content = defaultHoverInfoProcessor(info.text);
      if (!content || content === "any") {
        return node;
      }
      const result: any[] = [];
      const hastContent = this.codeToHast(content, {
        lang: this.options.lang === "tsx" || this.options.lang === "jsx" ? "tsx" : "ts",
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
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
          children: [
            {
              type: "text",
              value: info.docs,
            },
          ],
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
                      children: [
                        {
                          type: "text",
                          value: tag[1],
                        },
                      ],
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
          class: "twoslash-hover",
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
