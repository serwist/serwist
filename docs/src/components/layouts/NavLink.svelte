<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes } from "svelte/elements";

  import { clsx } from "$lib/clsx";

  interface NavLinkProps extends HTMLAnchorAttributes {
    href: string;
    isActive?: boolean;
    wideText?: boolean;
    textCenter?: boolean;
    button?: Snippet<[]>;
  }

  const { href, isActive = false, wideText = false, textCenter = true, children, button, ...props }: NavLinkProps = $props();
</script>

<span
  class={clsx(
    "transition-colors-opacity flex w-full cursor-pointer flex-row justify-between rounded-md duration-100",
    isActive ? "bg-gray-200 dark:bg-neutral-800" : "hover:bg-gray-200 dark:hover:bg-neutral-800"
  )}
>
  <a
    {href}
    class={clsx(
      "h-full w-full gap-2 break-words px-3 py-2 font-medium text-black dark:text-white",
      textCenter && "text-center",
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
