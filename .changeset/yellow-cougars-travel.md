---
"@serwist/turbopack": patch
---

feat(turbo): automatically load Next.js config

- The `nextConfig` option has been deprecated and will be removed with Serwist 10. Any option provided to it overrides that of the loaded Next.js configuration for now.

- This does not apply to Next.js versions older than 15.0.0. For such versions, you will still have to use the `nextConfig` option. `@serwist/turbopack`'s minimum supported Next.js version will be bumped to 15.0.0 with Serwist 10.