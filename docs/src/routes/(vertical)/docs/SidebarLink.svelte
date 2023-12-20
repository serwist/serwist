<script lang="ts" context="module">
  export interface SidebarLinkProps {
    title: string;
    href: string;
    children?: SidebarLinkProps[];
  }
</script>

<script lang="ts">
  import { page } from "$app/stores";
  import NavLink from "$components/layouts/NavLink.svelte";
  import { clsx } from "$lib/clsx";

  const { title, href, children } = $props<SidebarLinkProps>();
</script>

<li class="flex flex-col pt-2">
  <NavLink {href} textCenter={false} isActive={href === $page.url.pathname || href === `${$page.url.pathname}/`}>{title}</NavLink>
  {#if children}
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
