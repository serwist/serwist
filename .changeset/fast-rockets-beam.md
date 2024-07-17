---
"@serwist/webpack-plugin": patch
"@serwist/build": patch
"@serwist/next": patch
"@serwist/vite": patch
"@serwist/cli": patch
---

fix(dependencies): reverted `glob` to v10

- Turns out `glob` v11 drops support for Node.js 18, so we are back to v10 for now.

- This also adds test for Node.js 18 and 22.