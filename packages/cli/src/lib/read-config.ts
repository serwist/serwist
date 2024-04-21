/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import type { InjectManifestOptions } from "@serwist/build";

export const readConfig = async (configFile: string): Promise<InjectManifestOptions> => {
  return (await import(configFile)).default as InjectManifestOptions;
};
