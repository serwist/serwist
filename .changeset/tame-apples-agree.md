---
"@serwist/next": major
---

chore(next): renamed `cacheOnFrontEndNav` to `cacheOnNavigation`

- I intended to make this breaking change in 8.0.0, but forgot. To clarify, generally, we avoids abbreviations (except for acronyms) when naming our APIs.
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
