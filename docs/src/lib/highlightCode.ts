import type { BundledLanguage, Highlighter } from "shiki";
import { rendererRich, transformerTwoslash, type TransformerTwoslashIndexOptions } from "@shikijs/twoslash";
import { nonNullable } from "@serwist/utils";
import type { ModuleResolutionKind, ModuleDetectionKind, ModuleKind, ScriptTarget, JsxEmit } from "typescript";

interface HighlightCodeOptions {
  idPrefix: string;
}

const twoslashOptions = {
  renderer: rendererRich(),
  twoslashOptions: {
    compilerOptions: {
      noErrorTruncation: true,
      target: 99 satisfies ScriptTarget.ESNext,
      module: 99 satisfies ModuleKind.ESNext,
      moduleResolution: 100 satisfies ModuleResolutionKind.Bundler,
      moduleDetection: 3 satisfies ModuleDetectionKind.Force,
      lib: ["lib.dom.d.ts", "lib.esnext.d.ts", "lib.dom.iterable.d.ts", "lib.webworker.d.ts"],
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
} satisfies TransformerTwoslashIndexOptions;

// Seems that having multiple langs doesn't work, for now.
const tsTwoslash = transformerTwoslash(twoslashOptions);
const jsTwoslash = transformerTwoslash({
  langs: ["javascript"],
  ...twoslashOptions,
});
const tsxTwoslash = transformerTwoslash({
  langs: ["tsx"],
  ...twoslashOptions,
});
const jsxTwoslash = transformerTwoslash({
  langs: ["jsx"],
  ...twoslashOptions,
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
  { idPrefix }: HighlightCodeOptions,
) => {
  const codeEntries = Object.entries(codes) as [T, (typeof codes)[T]][];
  const result = [] as [T, string, string][];
  for (const [key, { code, lang }] of codeEntries) {
    const transformers = [
      lang === "typescript" ? tsTwoslash : lang === "javascript" ? jsTwoslash : lang === "tsx" ? tsxTwoslash : lang === "jsx" ? jsxTwoslash : null,
    ].filter(nonNullable);
    result.push([
      key,
      `${idPrefix}-${key.replace(/[ ()]/gm, "-")}`,
      highlighter.codeToHtml(code, {
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
        lang,
        transformers,
      }),
    ]);
  }
  return result;
};
