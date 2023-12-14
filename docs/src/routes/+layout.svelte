<script lang="ts">
  import "../app.css";

  import { page } from "$app/stores";
  import Navbar from "$components/layouts/Navbar.svelte";
  import { isColorScheme } from "$lib/isColorScheme";
  import { colorScheme } from "$lib/stores/colorScheme";

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
  <link rel="canonical" href={$page.url.href} />
  <meta name="theme-color" content={isDark ? "#000000" : "#FFFFFF"} />
</svelte:head>

<a class="absolute -top-full z-[100] text-black underline focus:top-0 dark:text-white" href="#main-content">Skip to main content</a>
<Navbar />
<main id="main-content"><slot /></main>
