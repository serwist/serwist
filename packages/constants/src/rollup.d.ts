import type { RollupOptions } from "rollup";

export declare const getRollupOptions: (options: {
  packageJson: PackageJson;
  jsFiles: FileEntry[];
  dtsFiles: FileEntry[];
  shouldMinify: boolean;
  shouldEmitDeclaration: boolean;
}) => RollupOptions[];
