<script lang="ts">
  import "../app.css";

  import { registerServiceWorker } from "@serwist/vite/virtual-svelte";

  import { page } from "$app/stores";
  import { isColorScheme } from "$lib/isColorScheme";
  import { colorScheme } from "$lib/stores/colorScheme";

  const { updateServiceWorker } = registerServiceWorker();

  $effect(() => updateServiceWorker());

  $effect(() => {
    const newTheme = document.documentElement.dataset.theme;
    $colorScheme = isColorScheme(newTheme) ? newTheme : "light";
    colorScheme.subscribe((value) => {
      document.documentElement.dataset.theme = value;
      localStorage.setItem("theme", value);
    });
  });

  const title = $derived($page.data.title ? `${$page.data.title} - Serwist` : "Serwist");

  const isDark = $derived($colorScheme === "dark");
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />
  <meta name="twitter:title" content={title} />
  <link rel="canonical" href={new URL($page.url.pathname, $page.url.origin).href} />
  <meta name="theme-color" content={isDark ? "#000000" : "#FFFFFF"} />
  <style>
    :root {
      --latin-unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074,
        U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 100;
      src: url("/fonts/geist-100.woff2") format("woff2");
      unicode-range: var(--latin-unicode-range);
    }

    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 200;
      src: url("/fonts/geist-200.woff2") format("woff2");
      unicode-range: var(--latin-unicode-range);
    }

    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 300;
      src: url("/fonts/geist-300.woff2") format("woff2");
      unicode-range: var(--latin-unicode-range);
    }

    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 400;
      src: url("/fonts/geist-400.woff2") format("woff2");
      unicode-range: var(--latin-unicode-range);
    }

    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 500;
      src: url("/fonts/geist-500.woff2") format("woff2");
      unicode-range: var(--latin-unicode-range);
    }

    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 600;
      src: url("/fonts/geist-600.woff2") format("woff2");
      unicode-range: var(--latin-unicode-range);
    }

    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 700;
      src: url("/fonts/geist-700.woff2") format("woff2");
      unicode-range: var(--latin-unicode-range);
    }

    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 800;
      src: url("/fonts/geist-800.woff2") format("woff2");
      unicode-range: var(--latin-unicode-range);
    }

    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 900;
      src: url("/fonts/geist-900.woff2") format("woff2");
      unicode-range: var(--latin-unicode-range);
    }
  </style>
</svelte:head>

<a class="absolute -top-full z-[100] text-black underline focus:top-0 dark:text-white" href="#main-content">Skip to main content</a>
<slot />
