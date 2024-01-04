<script lang="ts">
  import { quintOut } from "svelte/easing";
  import { slide } from "svelte/transition";

  import ChevronRight from "$components/icons/ChevronRight.svelte";
  import VerticalNavbar from "$components/layouts/VerticalNavbar.svelte";
  import { clsx } from "$lib/clsx";

  import { SIDEBAR_LINKS } from "./constants";
  import SidebarLink from "./SidebarLink.svelte";

  let mobileSidebarHidden = $state<boolean>(true);
</script>

<div class="flex h-full w-full flex-col md:flex-row">
  <div
    class={clsx(
      "print:hidden w-full max-h-dvh md:w-80 md:shrink-0 md:self-start z-10",
      "transform-gpu transition-all duration-150 ease-out sticky top-0",
      "px-2 md:px-4 pt-2 flex flex-col bg-white dark:bg-black md:bg-transparent dark:md:bg-transparent",
      "border-neutral-300 border-b-[0.25px] md:border-b-0 dark:border-gray-700"
    )}
  >
    <VerticalNavbar />
    <button
      class="z-20 flex h-fit w-full flex-row items-center justify-start gap-2 p-3 md:hidden duration-100 text-black dark:text-white"
      on:click={() => (mobileSidebarHidden = !mobileSidebarHidden)}
    >
      Menu
      <ChevronRight class={clsx("transition-transform duration-100", !mobileSidebarHidden && "rotate-90")} width={18} height={18} />
    </button>
    <!-- Desktop sidebar -->
    <aside class="py-4 self-stretch overflow-y-auto hidden md:block">
      <ul>
        {#each SIDEBAR_LINKS as sidebarLink}
          <SidebarLink {...sidebarLink} />
        {/each}
      </ul>
    </aside>
    <!-- Mobile sidebar -->
    {#if !mobileSidebarHidden}
      <aside class="pb-4 self-stretch overflow-y-auto md:hidden" transition:slide={{ duration: 200, easing: quintOut, axis: "y" }}>
        <ul>
          {#each SIDEBAR_LINKS as sidebarLink}
            <SidebarLink {...sidebarLink} />
          {/each}
        </ul>
      </aside>
    {/if}
  </div>
  <nav class="sticky top-0 order-last hidden w-[350px] max-h-screen shrink-0 px-4 print:hidden xl:block" aria-label="Table of contents">
    <div class="flex flex-col hyphens-auto pr-4 pt-6 text-sm ltr:-mr-4 rtl:-ml-4">
      <p class="mb-4 font-semibold tracking-tight text-black dark:text-white">On This Page</p>
      <div class="w-full self-stretch overflow-y-auto pointer-events-none" aria-hidden="true" />
      <div class="sticky bottom-0 mt-8 flex flex-col items-start gap-2 border-t pb-8 pt-8 dark:border-neutral-800">
        <a
          href="https://github.com/serwist/serwist/issues/new/choose"
          target="_blank"
          rel="noreferrer"
          class="text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          Question? Give us feedback →<span class="sr-only"> (opens in a new tab)</span>
        </a>
        <a
          href="https://github.com/serwist/serwist"
          target="_blank"
          rel="noreferrer"
          class="text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          Edit this page →<span class="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  </nav>
  <main id="main-content" class="w-full min-w-0 md:py-8">
    <article class="w-full min-w-0 max-w-6xl px-6 py-4 md:px-12">
      <slot />
    </article>
  </main>
</div>
