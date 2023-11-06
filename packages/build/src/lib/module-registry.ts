/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import { createRequire } from "node:module";

import { oneLine as ol } from "common-tags";

const require = createRequire(import.meta.url);

/**
 * Class for keeping track of which Serwist modules are used by the generated
 * service worker script.
 * TODO: do some sane shit.
 *
 * @private
 */
export class ModuleRegistry {
  private readonly _modulesUsed: Map<
    string,
    { moduleName: string; pkg: string }
  >;
  /**
   * @private
   */
  constructor() {
    this._modulesUsed = new Map();
  }

  #normalizePkgName(pkg: string) {
    return pkg.replace(/@(.*?)\/(.*?)/g, "$1_$2").replace(/-/g, "_");
  }

  /**
   * @returns A list of all of the import statements that are
   * needed for the modules being used.
   * @private
   */
  getImportStatements() {
    const serwistModuleImports: string[] = [];

    for (const [localName, { moduleName, pkg }] of this._modulesUsed) {
      const pkgPath = require.resolve(pkg);
      
      const importStatement = ol`import { ${moduleName} as ${localName} } from '${pkgPath}'`;
      serwistModuleImports.push(importStatement);
    }

    return serwistModuleImports;
  }

  /**
   * @param pkg The Serwist package that the module belongs to.
   * @param moduleName The name of the module to import.
   * @returns The local variable name that corresponds to that module.
   * @private
   */
  getLocalName(pkg: string, moduleName: string): string {
    return `${this.#normalizePkgName(pkg)}_${moduleName}`;
  }

  /**
   * @param pkg The Serwist package that the module belongs to.
   * @param moduleName The name of the module to import.
   * @returns The local variable name that corresponds to that module.
   * @private
   */
  use(pkg: string, moduleName: string): string {
    const localName = this.getLocalName(pkg, moduleName);
    this._modulesUsed.set(localName, { moduleName, pkg });

    return localName;
  }
}
