<script lang="ts">
  import { page } from "$app/stores";
  import ChevronRight from "$components/icons/ChevronRight.svelte";
  import NavLink from "$components/layouts/NavLink.svelte";
  import { clsx } from "$lib/clsx";
  import type { SidebarLink as SidebarLinkProps } from "$lib/types";

  import SidebarLink from "./SidebarLink.svelte";

  const { title, href, children }: SidebarLinkProps = $props();
  const isActive = $derived(href === $page.url.pathname || href === `${$page.url.pathname}/`);
  let isOpen = $state(false);

  $effect(() => {
    if (!isOpen) {
      isOpen = $page.url.pathname.startsWith(href);
    }
  });
</script>

<li class="flex flex-col pt-[5px]">
  {#if children}
    <details open={isOpen || $page.url.pathname.startsWith(href)} class="[&[open]>summary>span>svg]:rotate-90">
      <summary class="flex flex-row">
        <NavLink {href} {isActive} noEndRounded={isActive} textCenter={false}>
          {title}
        </NavLink>
        <span
          class={clsx(
            "flex items-center px-2 text-black transition-all duration-100 dark:text-white",
            isActive
              ? "bg-neutral-250 rounded-e border-l border-black/40 dark:border-white/40 dark:bg-neutral-800"
              : "hover:bg-neutral-250 rounded-sm dark:hover:bg-neutral-800"
          )}
        >
          <ChevronRight width={16} height={16} class="transition-transform duration-100" />
          <span class="sr-only">Expand section</span>
        </span>
      </summary>
      <div class="transform-gpu overflow-hidden opacity-100 transition-all duration-500 ease-in-out motion-reduce:transition-none ltr:pr-0 rtl:pl-0">
        <ul
          class={clsx(
            "relative flex flex-col before:absolute before:inset-y-1 ltr:ml-3 ltr:pl-3 rtl:mr-3 rtl:pr-3",
            "before:bg-neutral-250 before:w-px before:content-[''] ltr:before:left-0 rtl:before:right-0 dark:before:bg-neutral-800"
          )}
        >
          {#each children as child}
            <SidebarLink {...child} />
          {/each}
        </ul>
      </div>
    </details>
  {:else}
    <NavLink {href} textCenter={false} {isActive}>
      {title}
    </NavLink>
  {/if}
</li>
