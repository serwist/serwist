import type { WebpackInjectManifestOptions } from "@serwist/build";

export interface PluginOptions {
  /**
   * One or more specifiers used to exclude assets from the precache manifest.
   * This is interpreted following the same rules as webpack's standard `exclude`
   * option. Relative to `.next/static` or your custom build folder. Defaults to
   * [].
   * @example
   *   ```ts
   *   [/chunks\/images\/.*$/];
   *   ```
   * @default
   *   ```ts
   *   [];
   *   ```
   */
  buildExcludes?: WebpackInjectManifestOptions["exclude"];
  /**
   * Enable additional route caching when users navigate through pages with
   * `next/link`. This improves user experience in some cases but it
   * also adds some overhead because of additional network calls.
   * @default false
   */
  cacheOnFrontEndNav?: boolean;
  /**
   * Turn on caching for the start URL. [Discussion on use cases for this
   * option](https://github.com/shadowwalker/next-pwa/pull/296#issuecomment-1094167025)
   * @default true
   */
  cacheStartUrl?: boolean;
  /**
   * Set the output directory for service worker. Relative to your app's root
   * directory. By default, this plugin uses `public`.
   * @default "public"
   */
  dest?: string;
  /**
   * Whether Serwist should be disabled.
   * @default false
   */
  disable?: boolean;
  /**
   * If your start URL returns different HTML documents under different states
   * (such as logged in and not logged in), this should be set to true if you
   * also use `cacheStartUrl`. Effective only when `cacheStartUrl` is set to `true`.
   * Set to `false` if your start URL always returns same HTML document, in which case
   * the start URL will be precached, helping speed up the first load.
   * @default true
   */
  dynamicStartUrl?: boolean;
  /**
   * If your start URL redirects to another route such as `/login`, it's
   * recommended to specify this redirected URL for the best user experience.
   * Effective when `dynamicStartUrl` is set to `true`.
   * @default undefined
   */
  dynamicStartUrlRedirect?: string;
  /**
   * An array of glob pattern strings to exclude files in the public folder from
   * being precached. By default, this plugin excludes `public/noprecache`.
   * Note that you have to add `!` before each glob pattern for it to work.
   * @example
   *   ```ts
   *   ["!img/super-large-image.jpg", "!fonts/not-used-fonts.otf"];
   *   ```
   */
  publicExcludes?: string[];
  /**
   * URL scope for PWA. Set to `/foo/` so that paths under `/foo/` are PWA while others
   * are not.
   * @default nextConfig.basePath
   */
  scope?: string;
  /**
   * The service worker's output filename.
   * @default "/sw.js"
   */
  sw?: string;
  /**
   * Allow this plugin to automatically register the service worker for you. Set
   * this to `false` if you want to register the service worker yourself, which
   * can be done by running `window.serwist.register()` in
   * `componentDidMount` or `useEffect`.
   * @example
   *   ```tsx
   *   // app/register-pwa.tsx
   *   "use client";
   *   import { useEffect } from "react";
   *   import type { Serwist } from "@serwist/window";
   *
   *   declare global {
   *     interface Window {
   *       serwist: Serwist;
   *     }
   *   }
   *
   *   export default function RegisterPWA() {
   *     useEffect(() => {
   *       if ("serviceWorker" in navigator && window.serwist !== undefined) {
   *         window.serwist.register();
   *       }
   *     }, []);
   *     return <></>;
   *   }
   *
   *   // app/layout.tsx
   *   import RegisterPWA from "./register-pwa";
   *
   *   export default function RootLayout({
   *     children,
   *   }: {
   *     children: React.ReactNode;
   *   }) {
   *     return (
   *       <html lang="en">
   *         <head />
   *         <body>
   *           <RegisterPWA />
   *           {children}
   *         </body>
   *       </html>
   *     );
   *   }
   *   ```
   * @default true
   */
  register?: boolean;
  /**
   * Reload the app when it has gone back online.
   * @default true
   */
  reloadOnOnline?: boolean;
  /**
   * Pass options to `@serwist/webpack-plugin`.
   */
  buildOptions: WebpackInjectManifestOptions;
}
