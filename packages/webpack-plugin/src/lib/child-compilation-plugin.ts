import type { Compiler, WebpackError, WebpackPluginInstance } from "webpack";

import { performChildCompilation } from "./perform-child-compilation.js";
import { relativeToOutputPath } from "./relative-to-output-path.js";

export interface ChildCompilationPluginOptions {
  src: string;
  dest: string;
  plugins?: WebpackPluginInstance[];
}

/**
 * Compile a file by creating a child of the hooked compiler.
 *
 * @private
 */
export class ChildCompilationPlugin implements WebpackPluginInstance {
  src: string;
  dest: string;
  plugins: WebpackPluginInstance[] | undefined;
  constructor({ src, dest, plugins }: ChildCompilationPluginOptions) {
    this.src = src;
    this.dest = dest;
    this.plugins = plugins;
  }
  /**
   * @param compiler default compiler object passed from webpack
   *
   * @private
   */
  apply(compiler: Compiler) {
    compiler.hooks.make.tapPromise(this.constructor.name, (compilation) =>
      performChildCompilation(
        compiler,
        compilation,
        this.constructor.name,
        this.src,
        relativeToOutputPath(compilation, this.dest),
        this.plugins,
      ).catch((error: WebpackError) => {
        compilation.errors.push(error);
      }),
    );
  }
}
