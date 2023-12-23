<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes } from "svelte/elements";

  import { clsx } from "$lib/clsx";

  interface NavLinkProps extends HTMLAnchorAttributes {
    href: string;
    isActive?: boolean;
    wideText?: boolean;
    textCenter?: boolean;
    button?: Snippet<void>;
  }

  const { href, isActive = false, wideText = false, textCenter = true, children, button, ...props } = $props<NavLinkProps>();
</script>

<span
  class={clsx(
    "w-full transition-colors-opacity duration-100 rounded-md flex flex-row justify-between cursor-pointer",
    isActive ? "bg-gray-200 dark:bg-neutral-800" : "hover:bg-gray-200 dark:hover:bg-neutral-800"
  )}
>
  <a
    {href}
    class={clsx(
      "font-medium text-black dark:text-white",
      "flex gap-2 px-3 py-2 items-center justify-center",
      textCenter && "md:justify-center",
      wideText ? "shrink-0 text-base uppercase tracking-widest" : "text-base md:text-sm"
    )}
    aria-current={isActive}
    {...props}
  >
    {#if children}
      {@render children()}
    {/if}
  </a>
  {#if button}
    {@render button()}
  {/if}
</span>
