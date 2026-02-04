---
"@serwist/turbopack": patch
---

fix(turbo): force Turbopack not to resolve `esbuild` or `esbuild-wasm`

- This allows not installing either of those dependencies.