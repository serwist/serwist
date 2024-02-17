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
  const isActive = $derived(
    href === $page.url.pathname || href === `${$page.url.pathname}/`
  );
</script>

<li class="flex flex-col pt-2">
  {#snippet navLink()}
    <NavLink {href} textCenter={false} {isActive}>
      {title}
    </NavLink>
  {/snippet}
  {#if children}
    <details
      open={$page.url.pathname.startsWith(href)}
      class="[&[open]>summary>div>svg]:rotate-90"
    >
      <summary class={clsx("flex flex-row", isActive && "[&>span]:rounded-e-none")}>
        {@render navLink()}
        <div  
          class={clsx(
            "flex items-center px-1 text-black dark:text-white transition-all duration-100",
            isActive ? "border-l border-neutral-300 dark:border-gray-900 bg-gray-200 dark:bg-neutral-800 rounded-e" : "hover:bg-gray-200 hover:dark:bg-neutral-800 rounded"
          )}
        >
          <ChevronRight
            width={16}
            height={16}
            class="transition-transform duration-100"
          />
          <span class="sr-only">Expand section</span>
        </div>
      </summary>
      <div
        class="transform-gpu overflow-hidden transition-all ease-in-out motion-reduce:transition-none opacity-100 duration-500 ltr:pr-0 rtl:pl-0"
      >
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
    </details>
  {:else}
    {@render navLink()}
  {/if}
</li>
