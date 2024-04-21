<script lang="ts">
  import "$components/TwoslashHover.svelte";
  import "../app.css";

  import { getSerwist } from "virtual:serwist";

  import { mount, unmount } from "svelte";

  import { dev } from "$app/environment";
  import { page } from "$app/stores";
  import Twoslash from "$components/Twoslash.svelte";
  import { PUBLIC_CANONICAL_URL } from "$env/static/public";
  import { isColorScheme } from "$lib/isColorScheme";
  import { colorScheme } from "$lib/stores/colorScheme";
  import { REROUTE } from "$lib/constants";

  const { data, children } = $props();
  const isDark = $derived($colorScheme === "dark");
  const title = $derived($page.data.title ? `${$page.data.title} - Serwist` : "Serwist");
  const ogImage = $derived($page.data.ogImage ?? data.fallbackOgImage);

  $effect(() => {
    const twoslashElement = mount(Twoslash, {
      target: document.getElementById("root-container")!,
    });

    return () => unmount(twoslashElement);
  });

  $effect(() => {
    const registerSerwist = async () => {
      if (!dev && "serviceWorker" in navigator) {
        const serwist = await getSerwist();
        serwist?.addEventListener("installed", () => {
          console.log("Serwist installed!");
        });
        void serwist?.register();
      }
    };
    registerSerwist();
  });

  $effect(() => {
    const newTheme = document.documentElement.dataset.theme;
    $colorScheme = isColorScheme(newTheme) ? newTheme : "light";
    colorScheme.subscribe((value) => {
      document.documentElement.dataset.theme = value;
      localStorage.setItem("theme", value);
    });
  });
</script>

<svelte:head>
  <title>{title}</title>
  <link rel="canonical" href={new URL($page.url.pathname in REROUTE ? REROUTE[$page.url.pathname] : $page.url.pathname, PUBLIC_CANONICAL_URL).href} />
  <link rel="manifest" href="/manifest.webmanifest" />
  <meta property="og:title" content={title} />
  <meta property="og:image" content={ogImage} />
  <meta name="twitter:title" content={title} />
  <meta name="theme-color" content={isDark ? "#000000" : "#FFFFFF"} />
</svelte:head>

<a class="absolute -top-full z-[100] text-black underline focus:top-0 dark:text-white" href="#main-content">Skip to main content</a>
{@render children()}
