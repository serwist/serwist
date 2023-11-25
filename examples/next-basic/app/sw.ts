import { useSerwist } from "@serwist/sw";

useSerwist({
  // @ts-ignore
  manifestEntries: self.__WB_MANIFEST,
  runtimeCaching: [
    {
      urlPattern: "/",
      method: "GET",
      handler: "NetworkFirst",
      options: {
        plugins: [
          {
            cacheWillUpdate: async ({ response: e }) =>
              e && "opaqueredirect" === e.type ? new Response(e.body, { status: 200, statusText: "OK", headers: e.headers }) : e,
          },
        ],
        cacheName: "start-url",
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      method: "GET",
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-webfonts",
        expiration: { maxEntries: 4, maxAgeSeconds: 31536e3 },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      method: "GET",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "google-fonts-stylesheets",
        expiration: { maxEntries: 4, maxAgeSeconds: 604800 },
      },
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      method: "GET",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-font-assets",
        expiration: { maxEntries: 4, maxAgeSeconds: 604800 },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      method: "GET",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-image-assets",
        expiration: { maxEntries: 64, maxAgeSeconds: 2592e3 },
      },
    },
    {
      urlPattern: /\/_next\/static.+\.js$/i,
      method: "GET",
      handler: "CacheFirst",
      options: {
        cacheName: "next-static-js-assets",
        expiration: { maxEntries: 64, maxAgeSeconds: 86400 },
      },
    },
    {
      urlPattern: /\/_next\/image\?url=.+$/i,
      method: "GET",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "next-image",
        expiration: { maxEntries: 64, maxAgeSeconds: 86400 },
      },
    },
    {
      urlPattern: /\.(?:mp3|wav|ogg)$/i,
      method: "GET",
      handler: "CacheFirst",
      options: {
        cacheName: "static-audio-assets",
        expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
        rangeRequests: !0,
      },
    },
    {
      urlPattern: /\.(?:mp4|webm)$/i,
      method: "GET",
      handler: "CacheFirst",
      options: {
        cacheName: "static-video-assets",
        expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
        rangeRequests: !0,
      },
    },
    {
      urlPattern: /\.(?:js)$/i,
      method: "GET",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-js-assets",
        expiration: { maxEntries: 48, maxAgeSeconds: 86400 },
      },
    },
    {
      urlPattern: /\.(?:css|less)$/i,
      method: "GET",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-style-assets",
        expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
      },
    },
    {
      urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
      method: "GET",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "next-data",
        expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
      },
    },
    {
      urlPattern: /\.(?:json|xml|csv)$/i,
      method: "GET",
      handler: "NetworkFirst",
      options: {
        cacheName: "static-data-assets",
        expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
      },
    },
    {
      urlPattern: ({ sameOrigin: e, url: { pathname: s } }) => !(!e || s.startsWith("/api/auth/")) && !!s.startsWith("/api/"),
      method: "GET",
      handler: "NetworkFirst",
      options: {
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 16, maxAgeSeconds: 86400 },
      },
    },
    {
      urlPattern: ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        "1" === e.headers.get("RSC") && "1" === e.headers.get("Next-Router-Prefetch") && a && !s.startsWith("/api/"),
      method: "GET",
      handler: "NetworkFirst",
      options: {
        cacheName: "pages-rsc-prefetch",
        expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
      },
    },
    {
      urlPattern: ({ request: e, url: { pathname: s }, sameOrigin: a }) => "1" === e.headers.get("RSC") && a && !s.startsWith("/api/"),
      method: "GET",
      handler: "NetworkFirst",
      options: {
        cacheName: "pages-rsc",
        expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
      },
    },
    {
      urlPattern: ({ url: { pathname: e }, sameOrigin: s }) => s && !e.startsWith("/api/"),
      method: "GET",
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
        expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
      },
    },
    {
      urlPattern: ({ sameOrigin: e }) => !e,
      method: "GET",
      handler: "NetworkFirst",
      options: {
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 32, maxAgeSeconds: 3600 },
      },
    },
  ],
});
