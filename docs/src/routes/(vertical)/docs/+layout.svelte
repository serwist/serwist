<script lang="ts">
  import { page } from "$app/stores";
  import ChevronRight from "$components/icons/ChevronRight.svelte";
  import VerticalNavbar from "$components/layouts/VerticalNavbar.svelte";
  import Toc from "$components/Toc.svelte";
  import { clsx } from "$lib/clsx";
  import { TocObserver } from "$lib/TocObserver.svelte";
  import type { TocEntry } from "$lib/types";

  import { SIDEBAR_LINKS } from "./$layout.constants";
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
      "z-10 max-h-dvh w-full md:w-64 md:shrink-0 md:self-start xl:w-80 print:hidden",
      "sticky top-0 transform-gpu transition-all duration-150 ease-out",
      "flex flex-col bg-white px-2 pt-2 md:bg-transparent md:px-4 dark:bg-black dark:md:bg-transparent",
      "border-b-[0.25px] border-neutral-300 md:border-b-0 dark:border-gray-700"
    )}
  >
    <VerticalNavbar />
    <details bind:this={mobileMenu} id="sidebar-mobile-menu" class="details-anim overflow-y-auto md:hidden">
      <summary class="z-20 flex h-fit w-full flex-row items-center justify-start gap-2 p-3 text-black duration-100 md:hidden dark:text-white">
        Menu
        <ChevronRight class="details-chevron transition-transform duration-100" width={18} height={18} />
      </summary>
      <!-- Mobile sidebar -->
      <aside class="self-stretch pb-4 md:py-4 md:pb-0">
        <ul>
          {#each SIDEBAR_LINKS as sidebarLink}
            <SidebarLink {...sidebarLink} />
          {/each}
        </ul>
      </aside>
    </details>
    <!-- Desktop sidebar -->
    <aside class="hidden self-stretch overflow-y-auto pb-4 md:block md:py-4 md:pb-0">
      <ul>
        {#each SIDEBAR_LINKS as sidebarLink}
          <SidebarLink {...sidebarLink} />
        {/each}
      </ul>
    </aside>
  </div>
  <main id="main-content" class="flex w-full flex-col xl:flex-row xl:justify-between">
    <nav
      class="top-0 max-h-screen shrink-0 px-6 pt-6 md:px-12 xl:sticky xl:order-last xl:w-[350px] xl:px-4 print:hidden"
      aria-label="Table of contents"
    >
      <Toc {toc} baseEditUrl="https://github.com/serwist/serwist/tree/main/docs/src/routes/(vertical)" />
    </nav>
    <article class="w-full max-w-6xl p-6 md:px-12 md:pb-12 xl:pt-12">
      {@render children()}
    </article>
  </main>
</div>
