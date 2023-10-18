/*
  Copyright 2021 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

// import { ok } from "node:assert";
// import { createRequire } from "node:module";

// import cdn from "../cdn-details.json";
// import type { BuildType, SerwistPackageJSON } from "../types.js";
// import { errors } from "./errors.js";

// const require = createRequire(import.meta.url);

// function getVersionedURL(): string {
//   return `${getCDNPrefix()}/${cdn.latestVersion}`;
// }

// function getCDNPrefix() {
//   return `${cdn.origin}/${cdn.bucketName}/${cdn.releasesDir}`;
// }

// export function getModuleURL(moduleName: string, buildType: BuildType): string {
//   ok(moduleName, errors["no-module-name"]);

//   if (buildType) {
//     const pkgJson: SerwistPackageJSON = require(`${moduleName}/package.json`);
//     if (buildType === "dev" && pkgJson.serwist && pkgJson.serwist.prodOnly) {
//       // This is not due to a public-facing exception, so just throw an Error(),
//       // without creating an entry in errors.js.
//       throw Error(`The 'dev' build of ${moduleName} is not available.`);
//     }
//     return `${getVersionedURL()}/${moduleName}.${buildType.slice(0, 4)}.js`;
//   }
//   return `${getVersionedURL()}/${moduleName}.js`;
// }
