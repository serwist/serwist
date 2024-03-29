<script lang="ts">
  import { page } from "$app/stores";
  import Toc from "$components/Toc.svelte";
  import { TocObserver } from "$lib/TocObserver.svelte";
  import { GITHUB_REPO_URL } from "$lib/constants";

  const { data, children } = $props();
  const toc = $derived($page.data.toc);
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

<main id="main-content" class="flex w-full flex-col xl:flex-row xl:justify-between">
  {#if data.metadata}
    <nav
      class="top-0 max-h-screen shrink-0 px-6 pt-6 md:px-12 xl:sticky xl:order-last xl:w-[350px] xl:px-4 print:hidden"
      aria-label="Table of contents"
    >
      <Toc {toc} baseEditUrl={`${GITHUB_REPO_URL}/-/tree/main/docs/src/routes/(horizontal)?ref_type=heads`} />
    </nav>
    <article class="prose flex w-full max-w-6xl flex-col p-6 md:px-12 md:pb-12 xl:pt-12">
      <h1 id={data.metadata.title.id}>{data.metadata.title.content}</h1>
      <p class="text-comment">{data.metadata.date}</p>
      {@render children()}
    </article>
  {:else}
    <article class="prose flex w-full max-w-6xl flex-col p-6 md:px-12 md:pb-12 xl:pt-12">
      {@render children()}
    </article>
  {/if}
</main>
