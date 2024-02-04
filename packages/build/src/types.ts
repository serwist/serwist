import type { PackageJson } from "type-fest";
import type { z } from "zod";
import type { basePartial } from "./schema/basePartial.js";
import type { getManifestOptions } from "./schema/getManifestOptions.js";
import type { globPartial, optionalGlobDirectoryPartial, requiredGlobDirectoryPartial } from "./schema/globPartial.js";
import type { injectManifestOptions, viteInjectManifestOptions, webpackInjectManifestOptions } from "./schema/injectManifestOptions.js";
import type { injectPartial } from "./schema/injectPartial.js";
import type { manifestEntry } from "./schema/manifestEntry.js";
import type { manifestTransform, manifestTransformResult } from "./schema/manifestTransform.js";
import type { requiredSwDestPartial } from "./schema/swDestPartial.js";
import type { webpackInjectManifestPartial, webpackPartial } from "./schema/webpackPartial.js";

export type ManifestEntry = z.input<typeof manifestEntry>;

export type ManifestTransformResult = z.input<typeof manifestTransformResult>;

export type ManifestTransform = z.input<typeof manifestTransform>;

export type BasePartial = z.input<typeof basePartial>;

export type RequiredGlobDirectoryPartial = z.input<typeof requiredGlobDirectoryPartial>;

export type OptionalGlobDirectoryPartial = z.input<typeof optionalGlobDirectoryPartial>;

export type GlobPartial = z.input<typeof globPartial>;

export type InjectPartial = z.input<typeof injectPartial>;

export type WebpackPartial = z.input<typeof webpackPartial>;

export type RequiredSWDestPartial = z.input<typeof requiredSwDestPartial>;

export type WebpackInjectManifestPartial = z.input<typeof webpackInjectManifestPartial>;

export type GetManifestOptions = z.input<typeof getManifestOptions>;

export type InjectManifestOptions = z.input<typeof injectManifestOptions>;

export type WebpackInjectManifestOptions = z.input<typeof webpackInjectManifestOptions>;

export type ViteInjectManifestOptions = z.input<typeof viteInjectManifestOptions>;

export interface GetManifestResult {
  count: number;
  manifestEntries: ManifestEntry[] | undefined;
  size: number;
  warnings: string[];
}

export type BuildResult = Omit<GetManifestResult, "manifestEntries"> & {
  filePaths: string[];
};

/**
 * @private
 */
export interface FileDetails {
  file: string;
  hash: string;
  size: number;
}

/**
 * @private
 */
export type BuildType = "dev" | "prod";

/**
 * @private
 */
export type SerwistPackageJSON = PackageJson;

/**
 * @private
 */
export type MethodNames = "GetManifest" | "InjectManifest" | "WebpackInjectManifest" | "ViteInjectManifest";
