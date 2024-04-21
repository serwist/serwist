---
"@serwist/next": major
---

chore(next): renamed `cacheOnFrontEndNav` to `cacheOnNavigation`

- Generally, we avoid using abbreviations (except for acronyms) to name Serwist's APIs.

- To migrate, simply replace `cacheOnFrontEndNav` with `cacheOnNavigation`:

  - Old:

  ```js
  const withSerwist = withSerwistInit({
    cacheOnFrontEndNav: true,
  });

  /** @type {import("next").NextConfig} */
  const nextConfig = {};

  export default withSerwist(nextConfig);
  ```

  - New:

  ```js
  const withSerwist = withSerwistInit({
    cacheOnNavigation: true,
  });

  /** @type {import("next").NextConfig} */
  const nextConfig = {};

  export default withSerwist(nextConfig);
  ```
