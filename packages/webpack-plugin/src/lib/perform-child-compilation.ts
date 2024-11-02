import type { Compilation, Compiler } from "webpack";
import type { WebpackPlugin } from "./types.js";

/**
 * Perform a child compilation.
 *
 * @param compiler The parent webpack compiler.
 * @param compilation The webpack compilation.
 * @param name The name of the child compiler.
 * @param src The source file. Should be absolute.
 * @param dest The destination file. Should be relative to the compilation.
 * @param plugins Additional webpack plugins.
 *
 * @private
 */
export const performChildCompilation = async (
  compiler: Compiler,
  compilation: Compilation,
  name: string,
  src: string,
  dest: string,
  plugins: WebpackPlugin[] | undefined,
) => {
  const childCompiler = compilation.createChildCompiler(name, { filename: dest }, plugins);

  new compiler.webpack.webworker.WebWorkerTemplatePlugin().apply(childCompiler);

  new compiler.webpack.EntryPlugin(compiler.context, src, name).apply(childCompiler);

  await new Promise<void>((resolve, reject) => {
    childCompiler.runAsChild((error, _entries, childCompilation) => {
      if (error) {
        reject(error);
      } else {
        if (childCompilation?.warnings) {
          compilation.warnings.push(...childCompilation.warnings);
        }
        if (childCompilation?.errors) {
          compilation.errors.push(...childCompilation.errors);
        }
        resolve();
      }
    });
  });
};
