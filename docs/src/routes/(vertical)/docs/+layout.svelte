<script lang="ts">
  import { page } from "$app/stores";
  import ChevronRight from "$components/icons/ChevronRight.svelte";
  import VerticalNavbar from "$components/layouts/VerticalNavbar.svelte";
  import Toc from "$components/Toc.svelte";
  import { clsx } from "$lib/clsx";
  import { TocObserver } from "$lib/TocObserver.svelte";
  import type { TocEntry } from "$lib/types";

  import { SIDEBAR_LINKS } from "./constants";
  import SidebarLink from "./SidebarLink.svelte";

  const { children } = $props();
  let mobileMenu = $state<HTMLDetailsElement | undefined>(undefined);
  const toc = $derived($page.data.toc) as TocEntry[] | undefined;
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

  $effect(() => {
    $page.url.pathname;
    if (mobileMenu) {
      mobileMenu.open = false;
    }
  });
</script>

<div class="flex h-full w-full flex-col md:flex-row">
  <div
    id="sidebar-wrapper"
    class={clsx(
      "print:hidden w-full max-h-dvh md:w-52 xl:w-80 md:shrink-0 md:self-start z-10",
      "transform-gpu transition-all duration-150 ease-out sticky top-0",
      "px-2 md:px-4 pt-2 flex flex-col bg-white dark:bg-black md:bg-transparent dark:md:bg-transparent",
      "border-neutral-300 border-b-[0.25px] md:border-b-0 dark:border-gray-700"
    )}
  >
    <VerticalNavbar />
    <details bind:this={mobileMenu} id="sidebar-mobile-menu" class="details-anim overflow-y-auto md:hidden">
      <summary class="z-20 flex h-fit w-full flex-row items-center justify-start gap-2 p-3 md:hidden duration-100 text-black dark:text-white">
        Menu
        <ChevronRight class="details-chevron transition-transform duration-100" width={18} height={18} />
      </summary>
      <!-- Mobile sidebar -->
      <aside class="pb-4 md:pb-0 md:py-4 self-stretch">
        <ul>
          {#each SIDEBAR_LINKS as sidebarLink}
            <SidebarLink {...sidebarLink} />
          {/each}
        </ul>
      </aside>
    </details>
    <!-- Desktop sidebar -->
    <aside class="pb-4 md:pb-0 md:py-4 self-stretch overflow-y-auto hidden md:block">
      <ul>
        {#each SIDEBAR_LINKS as sidebarLink}
          <SidebarLink {...sidebarLink} />
        {/each}
      </ul>
    </aside>
  </div>
  <main id="main-content" class="w-full min-w-0 flex flex-col md:flex-row md:justify-between">
    <nav
      class="md:sticky top-0 md:order-last max-h-screen md:w-[250px] xl:w-[350px] shrink-0 px-6 md:px-4 print:hidden block pt-6"
      aria-label="Table of contents"
    >
      <Toc {toc} baseEditUrl="https://github.com/serwist/serwist/tree/main/docs/src/routes/(vertical)" />
    </nav>
    <article class="w-full min-w-0 max-w-6xl p-6 md:px-12 md:py-14">
      {@render children()}
    </article>
  </main>
</div>
