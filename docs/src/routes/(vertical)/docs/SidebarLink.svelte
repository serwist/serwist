<script lang="ts" context="module">
  export interface SidebarLinkProps {
    title: string;
    href: string;
    children?: SidebarLinkProps[];
  }
</script>

<script lang="ts">
  import { page } from "$app/stores";
  import ChevronRight from "$components/icons/ChevronRight.svelte";
  import NavLink from "$components/layouts/NavLink.svelte";
  import { clsx } from "$lib/clsx";

  const { title, href, children } = $props<SidebarLinkProps>();
  let isExpanded = $state($page.url.pathname.startsWith(href));
</script>

<li class="flex flex-col pt-2">
  <div class="flex flex-row w-full">
    <NavLink {href} textCenter={false} isActive={href === $page.url.pathname || href === `${$page.url.pathname}/`}>
      {title}
      {#snippet button()}
        {#if !!children?.length && children.length > 0}
          <span class="flex items-center justify-center p-1">
            <button
              on:click={() => (isExpanded = !isExpanded)}
              class={clsx(
                "rounded px-1 w-full h-full text-black dark:text-white transition-all duration-100",
                "hover:bg-gray-300 hover:text-gray-900 dark:hover:bg-neutral-600 dark:hover:text-gray-50"
              )}
              aria-label={`${isExpanded ? "Collapse" : "Expand"} section`}
            >
              <ChevronRight width={16} height={16} class={clsx("transition-transform duration-100", isExpanded && "rotate-90")} />
            </button>
          </span>
        {/if}
      {/snippet}
    </NavLink>
  </div>
  {#if children && isExpanded}
    <div class="transform-gpu overflow-hidden transition-all ease-in-out motion-reduce:transition-none opacity-100 duration-500 ltr:pr-0 rtl:pl-0">
      <ul
        class={clsx(
          "relative flex flex-col before:absolute before:inset-y-1 ltr:ml-3 ltr:pl-3 rtl:mr-3 rtl:pr-3",
          "ltr:before:left-0 rtl:before:right-0 before:w-px before:bg-gray-200 before:content-[''] dark:before:bg-neutral-800"
        )}
      >
        {#each children as child}
          <svelte:self {...child} />
        {/each}
      </ul>
    </div>
  {/if}
</li>
