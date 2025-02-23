// @ts-check
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
// @ts-expect-error weird typings
import { escapeSvelte, mdsvex } from "mdsvex";
import { highlighter, twoslash } from "./config-utils/shiki.js";
import { remarkToc } from "./config-utils/remark-toc.js";
import { rehypeSlug } from "./config-utils/rehype-slug.js";

// const dev = process.env.NODE_ENV !== "production";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJson = JSON.parse(readFileSync(path.join(__dirname, "../packages/core/package.json"), "utf-8"));

/**
 * @param {string} str
 * @returns
 */
const parseMetaString = (str) => {
  return Object.fromEntries(
    str.split(" ").reduce(
      (prev, curr) => {
        const [key, value] = curr.split("=");
        const isNormalKey = /^[A-Z0-9]+$/i.test(key);
        if (isNormalKey) {
          prev.push([key, value || true]);
        }
        return prev;
      },
      /** @type {[string, boolean | string][]} */ ([]),
    ),
  );
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".svx"],
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [
    vitePreprocess(),
    mdsvex({
      remarkPlugins: [[remarkToc, { ordered: true }]],
      rehypePlugins: [rehypeSlug],
      layout: {
        docs: path.join(__dirname, "./src/components/layouts/Docs.svelte"),
        blog: path.join(__dirname, "./src/components/layouts/Blog.svelte"),
      },
      highlight: {
        // @ts-expect-error weird typings
        async highlighter(code, lang, meta) {
          const metaObject = meta ? parseMetaString(meta) : {};
          return escapeSvelte(
            highlighter.codeToHtml(code, {
              themes: {
                light: "github-light",
                dark: "github-dark",
              },
              lang: lang ?? "text",
              transformers: [
                twoslash,
                {
                  pre(hast) {
                    if (hast.properties.twoslash) {
                      hast.properties.twoslash = undefined;
                    }
                    hast.properties.tabindex = -1;
                  },
                },
              ],
              meta: {
                ...metaObject,
                __raw: meta ?? undefined,
              },
            }),
          );
        },
      },
    }),
  ],
  compilerOptions: {
    customElement: true,
  },
  kit: {
    adapter: adapter(),
    alias: {
      $components: "./src/components",
      $images: "./src/images",
    },
    csp: {
      directives: {
        "script-src": ["self", "strict-dynamic", "sha256-DjP3mqXEHW08gJZjCdT8u4O2YkjsRGagw6vMJOyKiN4="],
      },
    },
    inlineStyleThreshold: 2048,
    paths: {
      relative: false,
    },
    prerender: {
      concurrency: 50,
      handleMissingId: "warn",
    },
    serviceWorker: {
      register: false,
    },
    version: {
      name: packageJson.version,
    },
  },
};

export default config;
