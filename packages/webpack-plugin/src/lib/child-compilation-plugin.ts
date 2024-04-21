import type { Compilation, Compiler, WebpackError, WebpackPluginInstance, default as Webpack } from "webpack";

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
  webpack: typeof Webpack;
  constructor({ src, dest, plugins }: ChildCompilationPluginOptions) {
    this.src = src;
    this.dest = dest;
    this.plugins = plugins;
    this.webpack = null!;
  }
  /**
   * @param compiler default compiler object passed from webpack
   *
   * @private
   */
  private propagateWebpackConfig(compiler: Compiler): void {
    this.webpack = compiler.webpack;
  }
  /**
   * @param compiler default compiler object passed from webpack
   *
   * @private
   */
  apply(compiler: Compiler) {
    this.propagateWebpackConfig(compiler);

    compiler.hooks.make.tapPromise(this.constructor.name, (compilation) =>
      this.performChildCompilation(compilation, compiler).catch((error: WebpackError) => {
        compilation.errors.push(error);
      }),
    );
  }
  /**
   * @param compilation The webpack compilation.
   * @param parentCompiler The webpack parent compiler.
   *
   * @private
   */
  private async performChildCompilation(compilation: Compilation, parentCompiler: Compiler): Promise<void> {
    const resolvedDest = relativeToOutputPath(compilation, this.dest);
    const outputOptions: Parameters<Compilation["createChildCompiler"]>["1"] = {
      filename: resolvedDest,
    };

    const childCompiler = compilation.createChildCompiler(this.constructor.name, outputOptions, []);

    childCompiler.context = parentCompiler.context;
    childCompiler.inputFileSystem = parentCompiler.inputFileSystem;
    childCompiler.outputFileSystem = parentCompiler.outputFileSystem;

    if (this.plugins !== undefined) {
      for (const plugin of this.plugins) {
        plugin?.apply(childCompiler);
      }
    }

    new this.webpack.EntryPlugin(parentCompiler.context, this.src, this.constructor.name).apply(childCompiler);

    await new Promise<void>((resolve, reject) => {
      childCompiler.runAsChild((error, _entries, childCompilation) => {
        if (error) {
          reject(error);
        } else {
          compilation.warnings = compilation.warnings.concat(childCompilation?.warnings ?? []);
          compilation.errors = compilation.errors.concat(childCompilation?.errors ?? []);

          resolve();
        }
      });
    });
  }
}
