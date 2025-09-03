---
"@serwist/turbopack": patch
---
<!-- Delete on release -->
fix(turbo/preview): removed `esbuild-wasm` from `dependencies`

- This caused problems with adding newer `esbuild-wasm` versions to `serverExternalPackages`.  