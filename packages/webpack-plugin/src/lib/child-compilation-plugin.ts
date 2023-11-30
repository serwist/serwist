import type { Compilation, WebpackPluginInstance } from "webpack";
import webpack from "webpack";

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
  apply(compiler: webpack.Compiler) {
    compiler.hooks.make.tapPromise(this.constructor.name, (compilation) =>
      this.performChildCompilation(compilation, compiler).catch((error: webpack.WebpackError) => {
        compilation.errors.push(error);
      })
    );
  }
  async performChildCompilation(compilation: webpack.Compilation, parentCompiler: webpack.Compiler): Promise<void> {
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

    new webpack.EntryPlugin(parentCompiler.context, this.src, this.constructor.name).apply(childCompiler);

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
