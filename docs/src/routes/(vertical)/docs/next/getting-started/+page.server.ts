import { getHighlighter } from "shiki";

import { highlightCode } from "$lib/highlightCode";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const highlighter = await getHighlighter({
    themes: ["github-light", "github-dark"],
    langs: ["bash", "typescript", "javascript", "tsx", "jsx", "json"],
  });
  return {
    title: "Getting started - @serwist/next",
    code: {
      install: highlightCode(
        highlighter,
        {
          npm: {
            code: "npm i @serwist/next",
            lang: "bash",
          },
          yarn: {
            code: "yarn add @serwist/next",
            lang: "bash",
          },
          pnpm: {
            code: "pnpm add @serwist/next",
            lang: "bash",
          },
          bun: {
            code: "bun add @serwist/next",
            lang: "bash",
          },
        },
        { idPrefix: "install-serwist-next-instruction" },
      ),
      basicUsage: {
        wrapConfig: highlightCode(
          highlighter,
          {
            "next.config.mjs": {
              code: `import withSerwistInit from "@serwist/next";
      
const withSerwist = withSerwistInit({
    // Note: This is only an example. If you use Pages Router,
    // use something else that works, such as "service-worker/index.ts".
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
});
         
export default withSerwist({
    // Your Next.js config
});`,
              lang: "javascript",
            },
            "next.config.js": {
              code: `const withSerwist = require("@serwist/next").default({
    // Note: This is only an example. If you use Pages Router,
    // use something else that works, such as "service-worker/index.ts".
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
});

module.exports = withSerwist({
    // Your Next.js config
});`,
              lang: "javascript",
            },
            "next.config.mjs (light)": {
              code: `// If your deployment platform requires your production image's size to not exceed a certain limit,
// you can also install \`@serwist/next\` as one of your \`devDependencies\` and do this:
import {
    PHASE_DEVELOPMENT_SERVER,
    PHASE_PRODUCTION_BUILD,
} from "next/constants.js";

export default async (phase) => {
    if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
        const withSerwist = (await import("@serwist/next")).default({
            // Note: This is only an example. If you use Pages Router,
            // use something else that works, such as "service-worker/index.ts".
            swSrc: "app/sw.ts",
            swDest: "public/sw.js",
        });
        return withSerwist(nextConfig);
    }
    return nextConfig;
};`,
              lang: "javascript",
            },
            "next.config.js (light)": {
              code: `// If your deployment platform requires your production image's size to not exceed a certain limit,
// you can also install \`@serwist/next\` as one of your \`devDependencies\` and do this:
const {
    PHASE_DEVELOPMENT_SERVER,
    PHASE_PRODUCTION_BUILD,
} = require("next/constants");

module.exports = (phase) => {
    if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
        const withSerwist = require("@serwist/next").default({
            // Note: This is only an example. If you use Pages Router,
            // use something else that works, such as "service-worker/index.ts".
            swSrc: "app/sw.ts",
            swDest: "public/sw.js",
        });
        return withSerwist(nextConfig);
    }
    return nextConfig;
};`,
              lang: "javascript",
            },
          },
          { idPrefix: "basic-usage-wrap-config-instruction" },
        ),
        createEntry: highlightCode(
          highlighter,
          {
            "sw.ts": {
              code: `import { defaultCache } from "@serwist/next/browser";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";

declare const self: ServiceWorkerGlobalScope & {
  // Change this attribute's name to your \`injectionPoint\`.
  // \`injectionPoint\` is an InjectManifest option.
  // See https://serwist.pages.dev/docs/build/inject-manifest/configuring
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});`,
              lang: "typescript",
            },
            "sw.js": {
              code: `import { defaultCache } from "@serwist/next/browser";
import { installSerwist } from "@serwist/sw";

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});`,
              lang: "javascript",
            },
          },
          { idPrefix: "basic-usage-create-entry-instruction" },
        ),
        createEntryAdditionalPackages: highlightCode(
          highlighter,
          {
            npm: {
              code: "npm i @serwist/precaching @serwist/sw",
              lang: "bash",
            },
            yarn: {
              code: "yarn add @serwist/precaching @serwist/sw",
              lang: "bash",
            },
            pnpm: {
              code: "pnpm add @serwist/precaching @serwist/sw",
              lang: "bash",
            },
            bun: {
              code: "bun add @serwist/precaching @serwist/sw",
              lang: "bash",
            },
          },
          {
            idPrefix: "basic-usage-create-usage-additional-packages-instruction",
          },
        ),
        tsConfig: highlightCode(
          highlighter,
          {
            "tsconfig.json": {
              code: `{
  // Other stuff...
  "compilerOptions": {
    // Other options...
    "types": [
      // Other types...
      // This allows Serwist to type \`window.serwist\`.
      "@serwist/next/typings"
    ],
    "lib": [
      // Other libs...
      // Add this! Doing so adds WebWorker and ServiceWorker types to the global.
      "webworker"
    ],
  },
}`,
              lang: "json",
            },
          },
          { idPrefix: "basic-usage-tsconfig-instruction" },
        ),
        manifestJson: highlightCode(
          highlighter,
          {
            "manifest.json": {
              code: `{
  "name": "My awesome PWA app",
  "short_name": "PWA App",
  "icons": [
    {
      "src": "/icons/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/android-chrome-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#FFFFFF",
  "background_color": "#FFFFFF",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait"
  // ...
}`,
              lang: "json",
            },
          },
          { idPrefix: "basic-usage-manifest-json-instruction" },
        )[0],
        metaAndLinkTags: highlightCode(
          highlighter,
          {
            "app/layout.tsx": {
              code: `import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

const APP_NAME = "PWA App";
const APP_DEFAULT_TITLE = "My Awesome PWA App";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "Best PWA app in the world!";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head />
      <body>{children}</body>
    </html>
  );
}`,
              lang: "tsx",
            },
            "app/layout.js": {
              code: `const APP_NAME = "PWA App";
const APP_DEFAULT_TITLE = "My Awesome PWA App";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "Best PWA app in the world!";

export const metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head />
      <body>{children}</body>
    </html>
  );
}`,
              lang: "jsx",
            },
            "pages/_app.tsx": {
              code: `import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>My awesome PWA app</title>
        <meta name="description" content="Best PWA app in the world!" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="mask-icon" href="/icons/mask-icon.svg" color="#FFFFFF" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/touch-icon-ipad.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/touch-icon-iphone-retina.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/touch-icon-ipad-retina.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://yourdomain.com" />
        <meta name="twitter:title" content="My awesome PWA app" />
        <meta name="twitter:description" content="Best PWA app in the world!" />
        <meta name="twitter:image" content="/icons/twitter.png" />
        <meta name="twitter:creator" content="@DavidWShadow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="My awesome PWA app" />
        <meta property="og:description" content="Best PWA app in the world!" />
        <meta property="og:site_name" content="My awesome PWA app" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:image" content="/icons/og.png" />
        {/* add the following only if you want to add a startup image for Apple devices. */}
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_2048.png"
          sizes="2048x2732"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1668.png"
          sizes="1668x2224"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1536.png"
          sizes="1536x2048"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1125.png"
          sizes="1125x2436"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1242.png"
          sizes="1242x2208"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_750.png"
          sizes="750x1334"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_640.png"
          sizes="640x1136"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
`,
              lang: "tsx",
            },
            "pages/_app.js": {
              code: `import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>My awesome PWA app</title>
        <meta name="description" content="Best PWA app in the world!" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="mask-icon" href="/icons/mask-icon.svg" color="#FFFFFF" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/touch-icon-ipad.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/touch-icon-iphone-retina.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/touch-icon-ipad-retina.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://yourdomain.com" />
        <meta name="twitter:title" content="My awesome PWA app" />
        <meta name="twitter:description" content="Best PWA app in the world!" />
        <meta name="twitter:image" content="/icons/twitter.png" />
        <meta name="twitter:creator" content="@DavidWShadow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="My awesome PWA app" />
        <meta property="og:description" content="Best PWA app in the world!" />
        <meta property="og:site_name" content="My awesome PWA app" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:image" content="/icons/og.png" />
        {/* add the following only if you want to add a startup image for Apple devices. */}
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_2048.png"
          sizes="2048x2732"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1668.png"
          sizes="1668x2224"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1536.png"
          sizes="1536x2048"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1125.png"
          sizes="1125x2436"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1242.png"
          sizes="1242x2208"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_750.png"
          sizes="750x1334"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_640.png"
          sizes="640x1136"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}`,
              lang: "jsx",
            },
          },
          { idPrefix: "basic-usage-meta-and-link-tags-instruction" },
        ),
      },
    },
  };
};
