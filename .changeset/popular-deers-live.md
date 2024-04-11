---
"@serwist/cacheable-response": major
"@serwist/navigation-preload": major
"@serwist/webpack-plugin": major
"@serwist/constants": major
"@serwist/routing": major
"@serwist/build": major
"@serwist/core": major
"@serwist/next": major
"@serwist/nuxt": major
"@serwist/vite": major
"@serwist/cli": major
"@serwist/sw": major
"serwist": major
---

chore(peerDeps): bump minimum supported TypeScript and Node.js version

- From now, we only support TypeScript versions later than 5.0.0 and Node.js ones later than 18.0.0.
- To migrate, simply update these tools.

```bash
# Change to your preferred way of updating Node.js
nvm use 18
# Change to your package manager
npm i -D typescript@5
```
