<script lang="ts">
  import { page } from "$app/stores";
  import ChevronRight from "$components/icons/ChevronRight.svelte";
  import VerticalNavbar from "$components/layouts/VerticalNavbar.svelte";
  import { clsx } from "$lib/clsx";
  import type { SidebarLink as SidebarLinkProps } from "$lib/types";

  import SidebarLink from "./SidebarLink.svelte";
  import { BLOG_ENTRIES } from "./blog/$layout.constants";
  import { DOCS_SIDEBAR_LINKS } from "./docs/$layout.constants";

  const sidebarLinks = $derived(
    $page.url.pathname.startsWith("/blog")
      ? BLOG_ENTRIES.map(({ title, href }) => ({ title: title.content, href }) satisfies SidebarLinkProps)
      : DOCS_SIDEBAR_LINKS
  );
  const { children } = $props();
  let sidebarDetails = $state<HTMLDetailsElement | undefined>(undefined);

  $effect(() => {
    if (sidebarDetails && window.innerWidth >= 1280) {
      sidebarDetails.open = true;
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
    {#if sidebarLinks && sidebarLinks.length > 0}
      <details bind:this={sidebarDetails} id="sidebar-mobile-menu" class="overflow-y-auto">
        <summary
          class="z-20 mt-[5px] flex h-fit w-full flex-row items-center justify-start gap-2 px-3 py-2 text-base font-medium text-black duration-100 md:text-sm dark:text-white"
        >
          Menu
          <ChevronRight class="details-chevron transition-transform duration-100" width={18} height={18} />
        </summary>
        <aside class="self-stretch pb-4 md:pb-0">
          <ul>
            {#each sidebarLinks as sidebarLink}
              <SidebarLink {...sidebarLink} />
            {/each}
          </ul>
        </aside>
      </details>
    {/if}
  </div>
  {@render children()}
</div>
