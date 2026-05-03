import path from "node:path";
import type { InputOption, OutputOptions } from "rolldown";

export const normalizeInput = (input: InputOption | undefined): Record<string, string> => {
  return !input
    ? {}
    : typeof input === "string"
      ? { [path.parse(input).name]: input }
      : Array.isArray(input)
        ? Object.fromEntries(input.map((entry) => [path.parse(entry).name, entry]))
        : input;
};

export const addChunkFilter = (options: OutputOptions) => {
  options.codeSplitting =
    options.codeSplitting === false
      ? false
      : {
          groups: [
            ...(options.codeSplitting === true ? [] : (options.codeSplitting?.groups ?? [])),
            {
              name: "serwist",
              test: /node_modules[\\/](serwist|vite-plugin-serwist|rollup-plugin-serwist|@serwist\/)/,
            },
          ],
        };
};

/**
 * Creates an importer function that generates `importScripts` statements for the given
 * import URI if it hasn't been imported before. The import URI is resolved from the service
 * worker's perspective based on the provided base path.
 *
 * @param importBase The base path to resolve import URIs against.
 * @returns A function that takes an import URI and returns an `importScripts` statement if
 * the URI hasn't been imported before, or an empty string if it has.
 */
export const createImporter = (importBase: string) => {
  const imported = new Set<string>();
  return (importUri: string) => {
    const resolvedImportUri = path.join(importBase, importUri);
    if (!imported.has(resolvedImportUri)) {
      imported.add(resolvedImportUri);
      return `importScripts("${resolvedImportUri}");`;
    }
    return "";
  };
};
