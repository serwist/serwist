import type { RollupOptions } from "rollup";

export type FileEntry = Pick<RollupOptions, "input" | "output" | "plugins"> & {
  external?: (string | RegExp)[] | string | RegExp;
};

export declare const getRollupOptions: (options: {
  packageJson: PackageJson;
  jsFiles: FileEntry[];
  dtsFiles: FileEntry[];
  shouldMinify: boolean;
  shouldEmitDeclaration: boolean;
}) => RollupOptions[];
