export type StringKeyOf<BaseType> = `${Extract<
  keyof BaseType,
  string | number
>}`;

export type BrowserslistOptions = string | string[] | Record<string, string>;

export interface NextBuildInfo {
  rootDir: string;
  destDir: string;
  basePath: string;
  buildId: string;
  pageExtensions: string[];
  isDev: boolean;
  isAppDirEnabled: boolean;
}
