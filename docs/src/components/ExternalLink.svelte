<script lang="ts">
  import type { HTMLAnchorAttributes } from "svelte/elements";

  interface ExternalLinkProps extends Omit<HTMLAnchorAttributes, "target" | "rel"> {}

  const { href, children, ...props }: ExternalLinkProps = $props();
</script>

<a {href} target="_blank" rel="noopener noreferrer" {...props}>
  {#if children}
    {@render children()}
  {/if}
</a>
