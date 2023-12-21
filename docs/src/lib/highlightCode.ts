import type { Highlighter, Lang } from "shiki";

export const highlightCode = <T extends string>(highlighter: Highlighter, codes: Record<T, { code: string; lang: Lang }>) => {
  const codeEntries = Object.entries(codes) as [T, (typeof codes)[T]][];
  const result = {} as Record<T, { dark: string; light: string }>;
  for (const [key, { code, lang }] of codeEntries) {
    result[key] = {
      dark: highlighter.codeToHtml(code, { theme: "github-dark", lang }),
      light: highlighter.codeToHtml(code, { theme: "github-light", lang }),
    };
  }
  return result;
};
