---
"@serwist/cli": patch
---

fix(cli): fix dist import

- cli.js was previously pointing to dist/bin.js, which no longer exists. This change updates the import path to dist/cli.mjs, ensuring that the CLI can be executed correctly.

- Tests for `@serwist/next`'s configurator mode and `@serwist/cli` have been added to prevent this issue from reoccurring.
