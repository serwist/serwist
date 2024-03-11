<script lang="ts">
  import { page } from "$app/stores";
  import type { TocEntry } from "$lib/types";

  import ChevronRight from "./icons/ChevronRight.svelte";
  import TocRenderer from "./TocRenderer.svelte";

  const { toc, baseEditUrl } = $props<{ toc: TocEntry[] | undefined; baseEditUrl: string }>();
  let tocDetails = $state<HTMLDetailsElement | null>(null);

  $effect(() => {
    // Toc is placed right above the content for devices of width smaller than 1280,
    // so manipulating `isTocOpen` for them is not a good idea due to CLS.
    if (tocDetails && window.innerWidth >= 1280) {
      tocDetails.open = true;
    }
  });
</script>

<details bind:this={tocDetails} class="-mr-4 flex h-full flex-col overflow-y-auto hyphens-auto pr-4 text-lg md:text-base xl:text-sm">
  <summary class="mb-4 flex items-center">
    <p class="font-semibold tracking-tight text-black dark:text-white">On This Page</p>
    <ChevronRight class="details-chevron ml-2 transition-transform duration-100" width={18} height={18} />
  </summary>
  <div class="pointer-events-none w-full self-stretch overflow-y-auto" aria-hidden="true" />
  {#if toc}
    <TocRenderer data={toc} />
  {:else}
    <p>Table of Contents is not available at the moment.</p>
  {/if}
  <div class="mt-8 hidden flex-col items-start gap-2 border-t pb-8 pt-8 xl:flex dark:border-neutral-800">
    <a href="https://github.com/serwist/serwist/issues/new/choose" target="_blank" rel="noreferrer" class="text-toc">
      Question? Give us feedback →
      <span class="sr-only">(opens in a new tab)</span>
    </a>
    <a href={`${baseEditUrl}${$page.url.pathname}`} target="_blank" rel="noreferrer" class="text-toc">
      Edit this page →<span class="sr-only"> (opens in a new tab)</span>
    </a>
  </div>
</details>
