<script lang="ts">
  import { page } from "$app/stores";
  import type { TocEntry } from "$lib/types";

  import ChevronRight from "./icons/ChevronRight.svelte";
  import TocRenderer from "./TocRenderer.svelte";

  const { toc, baseEditUrl } = $props<{ toc: TocEntry[] | undefined; baseEditUrl: string }>();
</script>

<details class="flex flex-col hyphens-auto pr-4 text-sm -mr-4" open>
  <summary class="flex items-center mb-4">
    <p class="font-semibold tracking-tight text-black dark:text-white">On This Page</p>
    <ChevronRight class="details-chevron ml-2 transition-transform duration-100" width={18} height={18} />
  </summary>
  <div class="w-full self-stretch overflow-y-auto pointer-events-none" aria-hidden="true" />
  {#if toc}
    <TocRenderer data={toc} />
  {:else}
    <p>Table of Contents is not available at the moment.</p>
  {/if}
  <div class="sticky bottom-0 mt-8 hidden md:flex flex-col items-start gap-2 border-t pb-8 pt-8 dark:border-neutral-800">
    <a
      href="https://github.com/serwist/serwist/issues/new/choose"
      target="_blank"
      rel="noreferrer"
      class="text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
    >
      Question? Give us feedback →
      <span class="sr-only">(opens in a new tab)</span>
    </a>
    <a
      href={`${baseEditUrl}${$page.url.pathname}`}
      target="_blank"
      rel="noreferrer"
      class="text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
    >
      Edit this page →<span class="sr-only"> (opens in a new tab)</span>
    </a>
  </div>
</details>
