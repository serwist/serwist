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

<div class="flex h-full w-full flex-col xl:flex-row xl:gap-8">
  {#if metadata}
    <nav
      class="top-0 max-h-screen shrink-0 px-6 pt-6 md:px-12 xl:sticky xl:order-last xl:w-[350px] xl:px-4 print:hidden"
      aria-label="Table of contents"
    >
      <Toc {toc} baseEditUrl="https://github.com/serwist/serwist/tree/main/docs/src/routes/(horizontal)" />
    </nav>
    <article class="mx-auto w-full min-w-0 p-6 md:px-12 md:pb-12 xl:max-w-screen-lg xl:pt-12">
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
