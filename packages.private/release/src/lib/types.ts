import type { PackageJSON } from "@changesets/types";

export interface Package {
  packageJson: PackageJSON;
  dir: string;
}
