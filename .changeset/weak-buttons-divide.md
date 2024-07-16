---
"@serwist/webpack-plugin": patch
---

fix(webpack-plugin): compatibility with Rspack

- Thanks @JoseVSeb! Quoting their message:

> Currently, `@serwist/webpack-plugin` fails to run in `Rspack` and `Rsbuild` by throwing `TypeError: Cannot set property warnings of #<Compilation> which has only a getter`.
> 
> The reason for this error is that `Compilation` instance in Rspack has read-only properties for `warnings` and `errors` arrays unlike webpack and the plugin tries to assign a concatenated array.
> 
> The issue can be remedied by using `push` instead of `concat` on the `warnings` and `errors` arrays.