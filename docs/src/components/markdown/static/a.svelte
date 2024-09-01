<script lang="ts">
  import type { HTMLAnchorAttributes } from "svelte/elements";

  import { clsx } from "$lib/clsx";

  const { href, class: className, children, ...props }: HTMLAnchorAttributes = $props();
</script>

{#if !href || href.startsWith("/") || href.startsWith("#") || href.startsWith(".")}
  <a {href} class={clsx("link", className)} {...props}>
    {#if children}
      {@render children()}
    {/if}
  </a>
{:else}
  <a {href} class={clsx("link", className)} target="_blank" rel="noopener noreferrer" {...props}>
    {#if children}
      {@render children()}
    {/if}
  </a>
{/if}
