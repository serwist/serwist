<script lang="ts">
  import "../app.css";

  import highlightjsLight from "highlight.js/styles/github.min.css?inline";
  import highlightjsDark from "highlight.js/styles/github-dark.min.css?inline";

  import { page } from "$app/stores";
  import { isColorScheme } from "$lib/isColorScheme";
  import { colorScheme } from "$lib/stores/colorScheme";

  let highlightStyle = $state<HTMLStyleElement | undefined>();

  $effect(() => {
    const newTheme = document.documentElement.dataset.theme;
    $colorScheme = isColorScheme(newTheme) ? newTheme : "light";
    colorScheme.subscribe((value) => {
      document.documentElement.dataset.theme = value;
      localStorage.setItem("theme", value);
      if (highlightStyle) {
        highlightStyle.innerHTML = value === "dark" ? highlightjsDark : highlightjsLight;
      }
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
  <style bind:this={highlightStyle}></style>
</svelte:head>

<a class="absolute -top-full z-[100] text-black underline focus:top-0 dark:text-white" href="#main-content">Skip to main content</a>
<slot />
