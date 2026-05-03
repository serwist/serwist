// @ts-check
import html, { makeHtmlAttributes } from "@rollup/plugin-html";
import { defineConfig } from "rolldown";
import { serwist } from "rolldown-plugin-serwist";

/** @type {(templateOptions: import("@rollup/plugin-html").RollupHtmlTemplateOptions) => string | Promise<string>} */
const template = ({ attributes, files, meta, publicPath, title, addScriptsToHead }) => {
  let scripts = (files.js || [])
    .filter((file) => file.type === "chunk" && file.isEntry && !file.fileName.includes("sw.js"))
    .map((file) => {
      const attrs = makeHtmlAttributes(attributes.script);
      return `<script src="${publicPath}${file.fileName}"${attrs}></script>`;
    })
    .join("\n");
  let links = (files.css || [])
    .map(({ fileName }) => {
      const attrs = makeHtmlAttributes(attributes.link);
      return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`;
    })
    .join("\n");
  if (addScriptsToHead === true) {
    links += scripts;
    scripts = "";
  }
  const metas = meta
    .map((input) => {
      const attrs = makeHtmlAttributes(input);
      return `<meta${attrs}>`;
    })
    .join("\n");
  return `
<!doctype html>
<html${makeHtmlAttributes(attributes.html)}>
  <head>
    ${metas}
    <title>${title}</title>
    ${links}
  </head>
  <body>
    <div>Hello, Rolldown!</div>
    ${scripts}
  </body>
</html>`;
};

export default defineConfig({
  input: "src/index.ts",
  plugins: [
    html({
      title: "Hello, Rolldown!",
      template,
    }),
    serwist({
      swSrc: "src/sw.ts",
      swDest: "dist/sw.js",
      globDirectory: "dist",
    }),
  ],
  output: {
    dir: "dist",
    minify: true,
    sourcemap: true,
  },
});
