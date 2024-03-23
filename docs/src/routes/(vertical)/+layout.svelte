<script lang="ts">
  import { page } from "$app/stores";
  import ChevronRight from "$components/icons/ChevronRight.svelte";
  import VerticalNavbar from "$components/layouts/VerticalNavbar.svelte";
  import { clsx } from "$lib/clsx";

  import SidebarLink from "./SidebarLink.svelte";

  const sidebarLinks = $derived($page.data.sidebar);
  const { children } = $props();
  let mobileMenu = $state<HTMLDetailsElement | undefined>(undefined);

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
    {#if sidebarLinks && sidebarLinks.length > 0}
      <details bind:this={mobileMenu} id="sidebar-mobile-menu" class="details-anim overflow-y-auto md:hidden">
        <summary class="z-20 flex h-fit w-full flex-row items-center justify-start gap-2 p-3 text-black duration-100 md:hidden dark:text-white">
          Menu
          <ChevronRight class="details-chevron transition-transform duration-100" width={18} height={18} />
        </summary>
        <!-- Mobile sidebar -->
        <aside class="self-stretch pb-4 md:py-4 md:pb-0">
          <ul>
            {#each sidebarLinks as sidebarLink}
              <SidebarLink {...sidebarLink} />
            {/each}
          </ul>
        </aside>
      </details>
      <!-- Desktop sidebar -->
      <aside class="hidden self-stretch overflow-y-auto pb-4 md:block md:py-4 md:pb-0">
        <ul>
          {#each sidebarLinks as sidebarLink}
            <SidebarLink {...sidebarLink} />
          {/each}
        </ul>
      </aside>
    {/if}
  </div>
  {@render children()}
</div>
