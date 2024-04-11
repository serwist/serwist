---
"@serwist/cacheable-response": major
"@serwist/navigation-preload": major
"@serwist/broadcast-update": major
"@serwist/google-analytics": major
"@serwist/background-sync": major
"@serwist/range-requests": major
"@serwist/webpack-plugin": major
"@serwist/expiration": major
"@serwist/precaching": major
"@serwist/strategies": major
"@serwist/constants": major
"@serwist/recipes": major
"@serwist/routing": major
"@serwist/streams": major
"@serwist/window": major
"@serwist/build": major
"@serwist/utils": major
"@serwist/core": major
"@serwist/next": major
"@serwist/nuxt": major
"@serwist/vite": major
"@serwist/cli": major
"@serwist/sw": major
"serwist": major
---

refactor(js): migrate to ESM-only

- Serwist is now an ESM-only project.
- This was done because our tooling around supporting CJS had always been crappy: it was slow, had no way of supporting emitting `.d.cts` (we used to copy `.d.ts` to `.d.cts`), and was too error-prone (there were various issues of our builds crashing due to an ESM-only package slipping in).
- If you already use ESM, there's nothing to be done. Great! Otherwise, to migrate:

  - Migrate to ESM if possible.
  - Otherwise, use dynamic imports. For example, to migrate to the new `@serwist/next`:

    - Old:

    ```js
    // @ts-check
    const withSerwist = require("@serwist/next").default({
      cacheOnNavigation: true,
      swSrc: "app/sw.ts",
      swDest: "public/sw.js",
    });
    /** @type {import("next").NextConfig} */
    const nextConfig = {
      reactStrictMode: true,
    };

    module.exports = withSerwist(nextConfig);
    ```

    - New:

    ```js
    // @ts-check
    /** @type {import("next").NextConfig} */
    const nextConfig = {
      reactStrictMode: true,
    };

    module.exports = async () => {
      const withSerwist = (await import("@serwist/next")).default({
        cacheOnNavigation: true,
        swSrc: "app/sw.ts",
        swDest: "public/sw.js",
      });
      return withSerwist(nextConfig);
    };
    ```

- I know that most of our current userbase use Next.js, which still suggests using a CJS config file, so I am really sorry for the trouble I have caused for you :( However, what needs to be done has to be done. It was time to migrate and get rid of old, legacy things.
