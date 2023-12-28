---
"@serwist/webpack-plugin": patch
"@serwist/core": patch
"@serwist/next": patch
"@serwist/vite": patch
---

fix(cjs): fixed CommonJS builds crashing

- Turns out we also need `chunkFileNames`, otherwise Rollup would always use ".js" for all the chunks. What in the world.
