// import type { GetManifestResult, BuildResult as InjectManifestResult } from "@serwist/build";
// import path from "node:path";
// import type { RolldownOutput, RolldownWatcher } from "rolldown";
// import { postprocessPlugin } from "rolldown-plugin-serwist";
// import type { SerwistViteContext } from "./context.js";
// import type { BuildResult } from "@serwist/build";
// import { cyan, dim, green, yellow } from "kolorist";
// import type { SerwistViteContext } from "./context.js";

// export const logSerwistResult = (buildResult: Pick<BuildResult, "count" | "size" | "warnings">, ctx: SerwistViteContext) => {
//   const { count, size, warnings } = buildResult;
//   const hasWarnings = warnings && warnings.length > 0;
//   ctx.logger[hasWarnings ? "warn" : "info"](
//     `${green("✓ files generated.")}\n${cyan(count)} precache entries ${dim(`(${(size / 1024).toFixed(2)} KiB)`)}${
//       hasWarnings ? `\n${yellow(["⚠ warnings", ...warnings.map((w) => `  ${w}`), ""].join("\n"))}` : ""
//     }`,
//   );
// };
// export const vite = import("vite");

// export const serwistBuild = import("@serwist/build");

// export interface BuildResult {
//   buildResult: RolldownOutput | RolldownOutput[] | RolldownWatcher;
//   injectManifestResult: GetManifestResult | InjectManifestResult | undefined;
// }

// export const build = async (ctx: SerwistViteContext): Promise<BuildResult> => {
//   const swDest = path.parse(ctx.options.injectManifest.swDest);

//   await ctx.options.integration?.beforeBuildServiceWorker?.(ctx.options);

//   const define: Record<string, any> = {
//     // Nuxt is weird: during the build, it manually defines browser APIs, such as `window`,
//     // `document`, `location`,..., as `undefined`. `define` doesn't seem to have anything
//     // particularly useful for the service worker as well, so we don't extend it.
//     ...(ctx.framework === "nuxt" ? undefined : ctx.viteConfig.define),
//     "process.env.NODE_ENV": `"${ctx.options.mode}"`,
//   };

//   let injectManifestResult: GetManifestResult | InjectManifestResult | undefined;

//   if (ctx.options.injectManifest.injectionPoint) {
//     injectManifestResult = await (await serwistBuild).getFileManifestEntries(ctx.options.injectManifest);

//     define[ctx.options.injectManifest.injectionPoint] =
//       injectManifestResult.manifestEntries === undefined ? "undefined" : JSON.stringify(injectManifestResult.manifestEntries);
//   }

//   let outputOptions = ctx.viteConfig.build.rolldownOptions.output;

//   if (!outputOptions) {
//     outputOptions = [{}];
//   } else if (!Array.isArray(outputOptions)) {
//     outputOptions = [outputOptions];
//   }

//   const buildResult = await (await vite).build({
//     ...ctx.userViteConfig,
//     define,
//     build: {
//       rolldownOptions: {
//         ...ctx.viteConfig.build.rolldownOptions,
//         ...ctx.options.rolldownOptions,
//         input: {
//           [swDest.name]: ctx.options.injectManifest.swSrc,
//         },
//         output: outputOptions.map((output) => ({
//           ...output,
//           format: "es",
//           entryFileNames: "[name].js",
//           chunkFileNames: !output.chunkFileNames
//             ? "serwist/[name]-[hash].js"
//             : typeof output.chunkFileNames === "string"
//               ? path.join(path.dirname(output.chunkFileNames), "serwist/[name]-[hash].js")
//               : output.chunkFileNames,
//         })),
//       },
//       outDir: swDest.dir,
//       emptyOutDir: false,
//       minify: ctx.options.mode === "production" || ctx.options.devOptions.minify,
//     },
//     publicDir: false,
//     plugins: [postprocessPlugin],
//     logLevel: ctx.viteConfig.isProduction ? "info" : "warn",
//     configFile: false,
//   });

//   if (injectManifestResult) {
//     if (ctx.viteConfig.isProduction) {
//       // Log Serwist result
//       logSerwistResult(injectManifestResult, ctx);
//     } else if (injectManifestResult.warnings && injectManifestResult.warnings.length > 0) {
//       ctx.logger.warn(["Warnings", ...injectManifestResult.warnings.map((w) => ` - ${w}`), ""].join("\n"));
//     }
//   }

//   return { buildResult, injectManifestResult };
// };
