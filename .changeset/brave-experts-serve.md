---
"vite-plugin-serwist": patch
---

fix(vite/preview): rename `virtual:serwist.svelte` to `virtual:serwist/svelte`

- Turns out that actually causes Svelte to think it's a `.svelte` file, not a `.svelte.js` one...