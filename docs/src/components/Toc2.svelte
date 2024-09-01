<script lang="ts">
  import { page } from "$app/stores";
  import { BREAKPOINTS, GITHUB_REPO_URL } from "$lib/constants";
  import type { List } from "mdast";
  import ChevronRight from "./icons/ChevronRight.svelte";
  import TocRenderer from "./TocRenderer2.svelte";

  const { headings }: { headings: List } = $props();
  let tocDetails = $state<HTMLDetailsElement | null>(null);

  $effect(() => {
    // Toc is placed right above the content for devices of width smaller than 1280,
    // so manipulating `isTocOpen` for them is not a good idea due to CLS.
    if (tocDetails && window.innerWidth >= BREAKPOINTS.lg) {
      tocDetails.open = true;
    }
  });
</script>

<details bind:this={tocDetails} class="details-anim flex h-full flex-col overflow-y-auto hyphens-auto text-lg md:text-base xl:text-sm">
  <summary class="mb-4 flex items-center">
    <span class="font-semibold tracking-tight text-black dark:text-white">On This Page</span>
    <ChevronRight class="details-chevron ml-2 transition-transform duration-100" width={18} height={18} />
  </summary>
  <div class="pointer-events-none w-full self-stretch overflow-y-auto" aria-hidden="true"></div>
  <TocRenderer {headings} />
  <div class="mt-8 hidden flex-col items-start gap-2 border-t border-neutral-300 pb-8 pt-8 xl:flex dark:border-neutral-800">
    <a href={`${GITHUB_REPO_URL}/issues/new/choose`} target="_blank" rel="noreferrer" class="text-toc">
      Question? Give us feedback →
      <span class="sr-only">(opens in a new tab)</span>
    </a>
    <a href={`${GITHUB_REPO_URL}/tree/main/docs/src/routes${$page.route.id}`} target="_blank" rel="noreferrer" class="text-toc">
      Edit this page →<span class="sr-only"> (opens in a new tab)</span>
    </a>
  </div>
</details>
