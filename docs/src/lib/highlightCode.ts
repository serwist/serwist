import type { BundledLanguage, Highlighter } from "shiki";

interface HighlightCodeOptions {
  idPrefix: string;
}

/**
 * Highlights some code for `<CodeTab />`.
 * 
 * @param highlighter 
 * @param codes 
 * @param options 
 * @returns 
 */
export const highlightCode = <T extends string>(
  highlighter: Highlighter,
  codes: Record<T, { code: string; lang: BundledLanguage }>,
  { idPrefix }: HighlightCodeOptions,
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
