<script lang="ts">
  import { page } from "$app/stores";
  import Toc from "$components/Toc.svelte";
  import { TocObserver } from "$lib/TocObserver.svelte";
  import type { BlogMetadata, TocEntry } from "$lib/types";

  const { children } = $props();
  const metadata = $derived($page.data.metadata as BlogMetadata | undefined);
  const toc = $derived($page.data.toc as TocEntry[] | undefined);
  let tocObserver: TocObserver | null = null;

  $effect(() => {
    if (!tocObserver) {
      tocObserver = new TocObserver();
    }
    tocObserver.observe(toc);
    return () => {
      tocObserver?.disconnect();
    };
  });
</script>

<div class="flex h-full w-full flex-col md:flex-row md:gap-8">
  {#if metadata}
    <nav class="sticky top-0 md:order-last max-h-screen md:w-[250px] xl:w-[350px] shrink-0 print:hidden pt-6 px-6 md:px-4" aria-label="Table of contents">
      <Toc {toc} baseEditUrl="https://github.com/serwist/serwist/tree/main/docs/src/routes/(horizontal)" />
    </nav>
    <article class="w-full min-w-0 md:max-w-screen-lg p-6 md:px-12 md:py-14 mx-auto">
      <h1 id={metadata.title.id}>{metadata.title.content}</h1>
      <br />
      <p class="text-comment">{metadata.date}</p>
      <br />
      {@render children()}
    </article>
  {:else}
    <h1>This page is missing a metadata. Please add it.</h1>
  {/if}
</div>
