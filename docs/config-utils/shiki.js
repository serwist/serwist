/** @import { JsxEmit, ModuleDetectionKind, ModuleKind, ModuleResolutionKind, ScriptTarget } from "typescript"; */
/**
 * @typedef {{
 *  idPrefix: string;
 *  useTwoslash?: boolean;
 * }} HighlightCodeOptions
 */
import { transformerTwoslash } from "@shikijs/twoslash";
import { createHighlighterCore, createJavaScriptRegexEngine } from "shiki";
import { renderer } from "./renderer.js";

const getTwoslash = () =>
  transformerTwoslash({
    explicitTrigger: true,
    langs: ["ts", "tsx", "js", "jsx"],
    langAlias: {
      typescript: "ts",
      javascript: "js",
    },
    renderer: renderer(),
    twoslashOptions: {
      compilerOptions: {
        noErrorTruncation: true,
        target: /** @type {ScriptTarget.ESNext} */ (99),
        module: /** @type {ModuleKind.ESNext} */ (99),
        moduleResolution: /** @type {ModuleResolutionKind.Bundler} */ (100),
        moduleDetection: /** @type {ModuleDetectionKind.Force} */ (3),
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
        jsx: /** @type {JsxEmit} */ (4),
      },
    },
  });

const getHighlighter = () =>
  createHighlighterCore({
    themes: [import("./themes/github-dark.js"), import("./themes/github-light.js")],
    langs: [
      import("shiki/langs/bash.mjs"),
      import("shiki/langs/json.mjs"),
      import("shiki/langs/typescript.mjs"),
      import("shiki/langs/javascript.mjs"),
      import("shiki/langs/tsx.mjs"),
      import("shiki/langs/jsx.mjs"),
      import("shiki/langs/svelte.mjs"),
      import("shiki/langs/html.mjs"),
      import("shiki/langs/vue.mjs"),
    ],
    engine: createJavaScriptRegexEngine(),
  });

export const twoslash = globalThis.__twoslash_server_singleton || getTwoslash();

export const highlighter = globalThis.__shiki_server_singleton || (await getHighlighter());

if (!globalThis.__twoslash_server_singleton) globalThis.__twoslash_server_singleton = twoslash;

if (!globalThis.__shiki_server_singleton) globalThis.__shiki_server_singleton = highlighter;
