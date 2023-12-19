<script lang="ts">
  import type { HTMLAnchorAttributes } from "svelte/elements";

  import { clsx } from "$lib/clsx";

  interface LinkProps extends Omit<HTMLAnchorAttributes, "class"> {
    unstyled?: boolean;
  }

  const { unstyled, children, ...props } = $props<LinkProps>();
</script>

<a class={clsx(!unstyled && "text-accent-light dark:text-accent-dark underline")} {...props}>
  {#if children}
    {@render children()}
  {/if}
</a>
