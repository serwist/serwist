// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
        dir: "ltr",
      },
      title: "Home",
      titleTemplate: "%s - NS App",
      link: [
        {
          rel: "manifest",
          href: "/manifest.json",
        },
        {
          rel: "shortcut icon",
          href: "/favicon.ico",
        },
        {
          rel: "apple-touch-icon",
          href: "/apple-touch-icon.png",
          sizes: "180x180",
        },
      ],
      meta: [
        {
          name: "application-name",
          content: "NS App",
        },
        {
          name: "description",
          content: "Nuxt + Serwist PWA",
        },
        {
          name: "apple-mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "default",
        },
        {
          name: "apple-mobile-web-app-title",
          content: "NS App",
        },
        {
          name: "format-detection",
          content: "telephone=no",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:title",
          content: "NS App",
        },
        {
          property: "og:description",
          content: "Nuxt + Serwist PWA",
        },
        {
          property: "og:site:name",
          content: "NS App",
        },
        {
          name: "twitter:card",
          content: "website",
        },
        {
          name: "twitter:title",
          content: "NS App",
        },
        {
          name: "twitter:description",
          content: "Nuxt + Serwist PWA",
        },
        {
          name: "theme-color",
          content: "#FFFFFF",
        },
      ],
    },
  },

  devtools: { enabled: true },
  modules: ["@serwist/nuxt"],
  serwist: {},
  compatibilityDate: "2025-04-21",
});
