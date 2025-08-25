---
"@serwist/turbopack": patch
---

fix(turbo/preview): removed `esbuild-wasm` from `dependencies`

- This caused problems with adding newer `esbuild-wasm` versions to `serverExternalPackages`.  