import type { WebpackInjectManifestOptions } from "@serwist/build";

type Require<T, U extends keyof T> = T & Required<Pick<T, U>>;

export interface PluginOptions extends Require<WebpackInjectManifestOptions, "swDest"> {
  /**
   * Enable additional route caching when users navigate through pages with
   * `next/link`. This improves the user experience in some cases but it
   * also adds a bit of overhead due to additional network calls.
   * @default false
   */
  cacheOnFrontEndNav?: boolean;
  /**
   * Whether Serwist should be disabled.
   * @default false
   */
  disable?: boolean;
  /**
   * URL scope for PWA. Set to `/foo/` so that paths under `/foo/` are PWA while others
   * are not.
   * @default nextConfig.basePath
   */
  scope?: string;
  /**
   * The URL to the service worker.
   * @default "/sw.js"
   */
  swUrl?: string;
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
}
