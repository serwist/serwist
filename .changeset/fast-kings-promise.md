---
"@serwist/cli": major
---

refactor(cli): removed/renamed certain features

- `copyLibraries` was already a no-op, so this simply removes the empty command.

- `wizard --injectManifest` has become `wizard`, thanks to the fact that GenerateSW no longer exists.

- Renamed the `injectManifest` command to `inject-manifest`. From now on, the CLI uses kebab-case rather than camelCase.
