<script lang="ts">
  import { page } from "$app/stores";
  import Toc from "$components/Toc.svelte";
  import { TocObserver } from "$lib/TocObserver.svelte";

  const { children } = $props();
  const toc = $derived($page.data.toc);

  $effect(() => {
    const tocObserver = new TocObserver();
    tocObserver.observe(toc);
    return () => {
      tocObserver?.disconnect();
    };
  });
</script>

<main id="main-content" class="flex w-full flex-col xl:flex-row xl:justify-between">
  <nav
    class="top-0 max-h-screen shrink-0 px-6 pt-6 md:px-12 xl:sticky xl:order-last xl:w-[350px] xl:px-4 print:hidden"
    aria-label="Table of contents"
  >
    <Toc {toc} />
  </nav>
  <article class="prose flex w-full max-w-6xl flex-col p-6 md:px-12 md:pb-12 xl:pt-12">
    {@render children()}
  </article>
</main>
