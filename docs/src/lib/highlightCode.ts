import { dev } from "$app/environment";
import { nonNullable } from "@serwist/utils";
import { transformerTwoslash } from "@shikijs/twoslash";
import type { BundledLanguage, Highlighter } from "shiki";
import type { JsxEmit, ModuleDetectionKind, ModuleKind, ModuleResolutionKind, ScriptTarget } from "typescript";
import { renderer } from "./renderer";

interface HighlightCodeOptions {
  idPrefix: string;
  useTwoslash?: boolean;
}

const twoslash = transformerTwoslash({
  langs: ["ts", "tsx", "js", "jsx"],
  langAlias: {
    typescript: "ts",
    javascript: "js",
  },
  renderer: renderer(),
  twoslashOptions: {
    compilerOptions: {
      noErrorTruncation: true,
      target: 99 satisfies ScriptTarget.ESNext,
      module: 99 satisfies ModuleKind.ESNext,
      moduleResolution: 100 satisfies ModuleResolutionKind.Bundler,
      moduleDetection: 3 satisfies ModuleDetectionKind.Force,
      lib: ["lib.dom.d.ts", "lib.esnext.d.ts", "lib.dom.iterable.d.ts", "lib.webworker.d.ts"],
      types: ["node"],
      skipLibCheck: true,
      strict: true,
      allowSyntheticDefaultImports: true,
      allowJs: true,
      checkJs: true,
      skipDefaultLibCheck: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      sourceMap: true,
      noUnusedLocals: false,
      noUnusedParameters: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      isolatedModules: true,
      verbatimModuleSyntax: true,
      removeComments: false,
      jsx: 4 satisfies JsxEmit,
    },
  },
});

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
  { idPrefix, useTwoslash = true }: HighlightCodeOptions,
) => {
  const codeEntries = Object.entries(codes) as [T, (typeof codes)[T]][];
  const result = [] as [T, string, string][];
  for (const [key, { code, lang }] of codeEntries) {
    result.push([
      key,
      `${idPrefix}-${key.replace(/[ ()]/gm, "-")}`,
      highlighter.codeToHtml(code, {
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
        lang,
        transformers: [!dev && useTwoslash ? twoslash : null].filter(nonNullable),
      }),
    ]);
  }
  return result;
};
