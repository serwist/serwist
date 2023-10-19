import { createRequire } from "node:module";

import { resolveSwc } from "./resolve-swc.js";

const require = createRequire(import.meta.url);

/**
 * swc-loader
 * @param source Source code
 * @param inputSourceMap Source map
 */
export function swcLoader(this: any, source: string, inputSourceMap: string) {
  // Make the loader async
  const callback = this.async();
  const filename = this.resourcePath;

  let loaderOptions =
    (typeof this.getOptions === "function"
      ? this.getOptions()
      : require("loader-utils").getOptions(this)) || {};

  // Standardize on 'sourceMaps' as the key passed through to webpack, so that
  // users may safely use either one alongside our default use of
  // 'this.sourceMap' below without getting error about conflicting aliases.
  if (
    Object.prototype.hasOwnProperty.call(loaderOptions, "sourceMap") &&
    !Object.prototype.hasOwnProperty.call(loaderOptions, "sourceMaps")
  ) {
    loaderOptions = Object.assign({}, loaderOptions, {
      sourceMaps: loaderOptions.sourceMap,
    });
    delete loaderOptions.sourceMap;
  }

  if (inputSourceMap && typeof inputSourceMap === "object") {
    inputSourceMap = JSON.stringify(inputSourceMap);
  }

  const programmaticOptions = Object.assign({}, loaderOptions, {
    filename,
    inputSourceMap: inputSourceMap || undefined,

    // Set the default sourcemap behavior based on webpack's mapping flag,
    // but allow users to override if they want.
    sourceMaps:
      loaderOptions.sourceMaps === undefined
        ? this.sourceMap
        : loaderOptions.sourceMaps,

    // Ensure that webpack will get a full absolute path in the sourcemap
    // so that it can properly map the module back to its internal cached
    // modules.
    sourceFileName: filename,
  });
  if (!programmaticOptions.inputSourceMap) {
    delete programmaticOptions.inputSourceMap;
  }
  const sync = programmaticOptions.sync;
  const parseMap = programmaticOptions.parseMap;

  const swc = resolveSwc();

  // Remove loader related options
  delete programmaticOptions.sync;
  delete programmaticOptions.parseMap;
  delete programmaticOptions.customize;
  delete programmaticOptions.cacheDirectory;
  delete programmaticOptions.cacheIdentifier;
  delete programmaticOptions.cacheCompression;
  delete programmaticOptions.metadataSubscribers;

  // auto detect development mode
  if (
    this.mode &&
    programmaticOptions.jsc &&
    programmaticOptions.jsc.transform &&
    programmaticOptions.jsc.transform.react &&
    !Object.prototype.hasOwnProperty.call(
      programmaticOptions.jsc.transform.react,
      "development"
    )
  ) {
    programmaticOptions.jsc.transform.react.development =
      this.mode === "development";
  }

  if (programmaticOptions.sourceMaps === "inline") {
    // Babel has this weird behavior where if you set "inline", we
    // inline the sourcemap, and set 'result.map = null'. This results
    // in bad behavior from Babel since the maps get put into the code,
    // which webpack does not expect, and because the map we return to
    // webpack is null, which is also bad. To avoid that, we override the
    // behavior here so "inline" just behaves like 'true'.
    programmaticOptions.sourceMaps = true;
  }

  try {
    if (sync) {
      const output = swc.transformSync(source, programmaticOptions);
      callback(
        null,
        output.code,
        parseMap && output.map ? JSON.parse(output.map) : output.map
      );
    } else {
      swc.transform(source, programmaticOptions).then(
        (output) => {
          callback(
            null,
            output.code,
            parseMap && output.map ? JSON.parse(output.map) : output.map
          );
        },
        (err) => {
          callback(err);
        }
      );
    }
  } catch (e) {
    callback(e);
  }
}
