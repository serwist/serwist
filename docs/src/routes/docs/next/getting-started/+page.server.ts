import highlightjs from "highlight.js/lib/core";

import type { PageServerLoad } from "./$types";

highlightjs.registerLanguage("bash", (await import("highlight.js/lib/languages/bash")).default);
highlightjs.registerLanguage("javascript", (await import("highlight.js/lib/languages/javascript")).default);
highlightjs.registerLanguage("typescript", (await import("highlight.js/lib/languages/typescript")).default);
highlightjs.registerLanguage("json", (await import("highlight.js/lib/languages/json")).default);

export const load: PageServerLoad = () => {
  return {
    code: {
      install: {
        npm: highlightjs.highlight(`npm i @serwist/next`, { language: "bash" }).value,
        yarn: highlightjs.highlight(`yarn add @serwist/next`, { language: "bash" }).value,
        pnpm: highlightjs.highlight(`pnpm add @serwist/next`, { language: "bash" }).value,
        bun: highlightjs.highlight(`bun add @serwist/next`, { language: "bash" }).value,
      },
      basicUsage: {
        wrapConfig: {
          configMjs: highlightjs.highlight(
            `import withSerwistInit from "@serwist/next";
      
const withSerwist = withSerwistInit({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
});
         
export default withSerwist({
    // Your Next.js config
});`,
            { language: "javascript" }
          ).value,
          configJs: highlightjs.highlight(
            `const withSerwist = require("@serwist/next").default({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
});
      
module.exports = withSerwist({
    // Your Next.js config
});`,
            { language: "javascript" }
          ).value,
          lightConfigMjs: highlightjs.highlight(
            `// If your deployment platform requires your production image's size to not exceed a certain limit,
// you can also install \`@serwist/next\` as one of your \`devDependencies\` and do this:
import {
    PHASE_DEVELOPMENT_SERVER,
    PHASE_PRODUCTION_BUILD,
} from "next/constants.js";

export default async (phase) => {
    if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
        const withSerwist = (await import("@serwist/next")).default({
            swSrc: "app/sw.ts",
            swDest: "public/sw.js",
        });
        return withSerwist(nextConfig);
    }
    return nextConfig;
};`,
            { language: "javascript" }
          ).value,
          lightConfigJs: highlightjs.highlight(
            `// If your deployment platform requires your production image's size to not exceed a certain limit,
// you can also install \`@serwist/next\` as one of your \`devDependencies\` and do this:
const {
    PHASE_DEVELOPMENT_SERVER,
    PHASE_PRODUCTION_BUILD,
} = require("next/constants");

module.exports = (phase) => {
    if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
        const withSerwist = require("@serwist/next").default({
            swSrc: "app/sw.ts",
            swDest: "public/sw.js",
        });
        return withSerwist(nextConfig);
    }
    return nextConfig;
};`,
            { language: "javascript" }
          ).value,
        },
        createEntry: {
          ts: highlightjs.highlight(
            `import { defaultCache } from "@serwist/next/browser";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";

declare const self: ServiceWorkerGlobalScope & {
  // Change this attribute's name to your \`injectionPoint\`.
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});`,
            { language: "typescript" }
          ).value,
          js: highlightjs.highlight(
            `import { defaultCache } from "@serwist/next/browser";
import { installSerwist } from "@serwist/sw";

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});`,
            { language: "javascript" }
          ).value,
        },
        manifestJson: highlightjs.highlight(
          `{
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
}`,
          { language: "json" }
        ).value,
      },
    },
  };
};
