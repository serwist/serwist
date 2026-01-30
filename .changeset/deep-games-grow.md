---
"@serwist/turbopack": patch
---

feat(turbo): allow using native esbuild

- Set `useNativeEsbuild` to `true` to use native esbuild, which is faster and works on Windows, instead of esbuild-wasm.

- `useNativeEsbuild` defaults to `true` on Windows systems.