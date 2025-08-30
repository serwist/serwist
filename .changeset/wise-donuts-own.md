---
"serwist": minor
---

feat(core): added `requestRules`

- This uses the Service Worker Static Routing API. From https://developer.chrome.com/blog/service-worker-static-routing: "This API lets you declaratively state how certain resource paths should be fetched, meaning that the browser does not need to run a service worker only to fetch responses from a cache, or directly from the network."

- Usage example:

```ts
const serwist = new Serwist({
  // Other options...
  // See https://developer.mozilla.org/en-US/docs/Web/API/InstallEvent/addRoutes#examples for more information.
  requestRules: {
    condition: {
      or: [{ urlPattern: "*.png" }, { urlPattern: "*.jpg" }],
    },
    source: {
      cacheName: "pictures",
    },
  },
});
```