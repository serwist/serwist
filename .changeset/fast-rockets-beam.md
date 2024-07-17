---
"@serwist/webpack-plugin": patch
"@serwist/build": patch
"@serwist/next": patch
"@serwist/vite": patch
"@serwist/cli": patch
---

fix(dependencies): reverted `glob` to v10 and `rimraf` to v5

- Turns out `glob` v11 and `rimraf` v6 drops support for Node.js 18, so we are back to v10 and v5 for now.

- This also adds test for Node.js 18 and 22.