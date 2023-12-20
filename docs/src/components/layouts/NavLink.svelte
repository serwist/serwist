<script lang="ts">
  import type { HTMLAnchorAttributes } from "svelte/elements";

  import { clsx } from "$lib/clsx";

  interface NavLinkProps extends HTMLAnchorAttributes {
    href: string;
    isActive?: boolean;
    wideText?: boolean;
    textCenter?: boolean;
  }

  const { href, isActive = false, wideText = false, textCenter = true, ...props } = $props<NavLinkProps>();
</script>

<a
  {href}
  class={clsx(
    "transition-colors-opacity font-medium text-black duration-100 dark:text-white",
    "flex gap-2 rounded-md px-3 py-2 items-center",
    textCenter && "md:justify-center",
    wideText ? "shrink-0 text-base uppercase tracking-widest" : "text-base md:text-sm",
    isActive ? "bg-gray-200 dark:bg-neutral-800" : "hover:bg-gray-200 dark:hover:bg-neutral-800"
  )}
  aria-current={isActive}
  {...props}
>
  <slot />
</a>
