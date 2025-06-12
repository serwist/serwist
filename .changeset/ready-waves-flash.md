---
"@serwist/nuxt": patch
---

fix: prefer `nitro.static` over `_generate`

- Thanks @danielroe! Here's the PR message:

Since nuxi v3.8, we've supported setting `nuxt.options.nitro.static` instead of `nuxt.options._generate` (which is an internal flag) - see https://github.com/nuxt/nuxt/pull/21860.

Now, in preparation for Nuxt v4, we've removed the types for `_generate` (see https://github.com/nuxt/nuxt/pull/32355). This PR adds support for new version in backwards compatible way (ignoring type issues) - I'd suggest you remove support in a future major.