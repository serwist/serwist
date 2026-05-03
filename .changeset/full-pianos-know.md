---
"@serwist/turbopack": patch
"@serwist/next": patch
---

chore(next, turbo): added `"use client"` to index.react.tsx

- Rolldown allows [the usage of additional directives such as `"use client"`](https://rolldown.rs/in-depth/directives#other-directives) when the directive is not in the top-level scope or when the directive is in the top-level scope, and either the module is an entry module, or `output.preserveModules` is enabled. Given that index.react.tsx is an entry module, we can add the `"use client"` directive to it, and it will be preserved in the output. This allows users to import the file directly in React Server Components without needing to add the directive themselves.