---
"@serwist/turbopack": patch
---
<!-- Delete on release -->
fix(turbo/preview): handle `assetPrefix`, `distDir`, `dontCacheBustURLsMatching`

- `@serwist/turbopack` now sets `dontCacheBustURLsMatching` to `/_next/static` by default.

- `assetPrefix` and `distDir` are now properly handled.

- BREAKING CHANGE (Preview): `basePath` has now been moved to `nextConfig.basePath` and is no longer required.