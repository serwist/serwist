import type { Preset } from "@react-router/dev/config";

export type ResolvedReactRouterConfig = Parameters<NonNullable<Preset["reactRouterConfigResolved"]>>[0]["reactRouterConfig"];

export interface ReactRouterPluginContext {
  reactRouterConfig: ResolvedReactRouterConfig;
  publicPath: string;
  rootDirectory: string;
  entryClientFilePath: string;
  entryServerFilePath: string;
  viteManifestEnabled: boolean;
  isSsrBuild: boolean;
}
