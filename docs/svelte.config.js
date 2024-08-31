// @ts-check
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { escapeSvelte, mdsvex } from "mdsvex";
import { highlighter, twoslash } from "./config-utils/shiki.js";
import { remarkToc, rehypeSlug } from "./config-utils/plugins.js";

const dev = process.env.NODE_ENV !== "production";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJson = JSON.parse(readFileSync(path.join(__dirname, "../packages/core/package.json"), "utf-8"));

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".svx"],
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [
    vitePreprocess(),
    mdsvex({
      remarkPlugins: [remarkToc],
      rehypePlugins: [rehypeSlug],
      layout: {
        docs: path.join(__dirname, "./src/components/Layout.svelte")
      },
      highlight: {
        async highlighter(code, lang) {
          return escapeSvelte(
            highlighter.codeToHtml(code, {
              themes: {
                light: "github-light",
                dark: "github-dark",
              },
              lang: lang ?? "text",
              transformers: [!dev ? twoslash : null].filter((value) => value !== null && value !== undefined),
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
      concurrency: 20,
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
