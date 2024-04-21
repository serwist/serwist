---
"@serwist/webpack-plugin": major
"@serwist/build": major
"@serwist/next": major
"@serwist/vite": major
---

refactor(build): moved framework-specific types out of `@serwist/build`

- Types the likes of `WebpackPartial`, `WebpackInjectManifestOptions`, `ViteInjectManifestOptions`, along with their according validators have been moved out of `@serwist/build`.

- This design, a relic of Workbox, never made any sense in the first place. As such, we are getting rid of it and migrating to a design where types and validators are co-located with their related packages.

- To migrate, update the imports:

  - `@serwist/build.WebpackPartial` -> `@serwist/webpack-plugin.WebpackPartial`

  - `@serwist/build.WebpackInjectManifestOptions` -> `@serwist/webpack-plugin.InjectManifestOptions`

  - `@serwist/build.WebpackInjectManifestPartial` -> `Omit<import("@serwist/webpack-plugin").InjectManifestOptions, keyof import("@serwist/build").BasePartial | keyof import("@serwist/build").InjectPartial | keyof import("@serwist/webpack-plugin").WebpackPartial | keyof import("@serwist/build").OptionalSwDestPartial>`

  - `@serwist/build.ViteInjectManifestOptions` -> `@serwist/vite.PluginOptions`

- With this change, validators and schemas have also been made public. Validators can be imported from "/" files, whereas schemas can be imported from "/schema" ones.
