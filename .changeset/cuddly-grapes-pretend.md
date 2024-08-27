---
"@serwist/webpack-plugin": patch
---

fix(webpack-plugin): explicitly call webpack's internal `WebWorkerTemplatePlugin`

- This plugin calls `ArrayPushCallbackChunkFormatPlugin` on our child compiler, allowing chunks to work properly.