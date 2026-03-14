---
"@serwist/turbopack": patch
---

fix(turbo): resolve `default.default` breaking bun build

- What? Fix CJS/ESM interop issue when loading `next/dist/server/config.js` in the `@serwist/turbopack` package.

- Why? When building a Next.js app inside a Bun Docker container (`oven/bun:1`),  the module `next/dist/server/config.js` resolves differently than in Node.js.  Specifically, `nextConfig.default.default` is `undefined` instead of a function, causing the build to crash at the "Collecting page data" step.

- How? Instead of calling `nextConfig.default.default(...)` directly, the fix checks whether `nextConfig.default?.default` is a function first. If it is, it uses it; otherwise it falls back to `nextConfig.default`. This handles both CJS and ESM module resolution correctly.