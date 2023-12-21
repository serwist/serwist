import type { Highlighter, Lang } from "shiki";

interface HighlightCodeOptions {
  idPrefix: string;
}

export const highlightCode = <T extends string>(
  highlighter: Highlighter,
  codes: Record<T, { code: string; lang: Lang }>,
  { idPrefix }: HighlightCodeOptions
) => {
  const codeEntries = Object.entries(codes) as [T, (typeof codes)[T]][];
  const result = [] as [T, string, { dark: string; light: string }][];
  for (const [key, { code, lang }] of codeEntries) {
    result.push([
      key,
      `${idPrefix}-${key.replace(/[ ()]/gm, "-")}`,
      {
        dark: highlighter.codeToHtml(code, { theme: "github-dark", lang }),
        light: highlighter.codeToHtml(code, { theme: "github-light", lang }),
      },
    ]);
  }
  return result;
};
