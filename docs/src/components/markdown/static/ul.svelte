<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { clsx } from "$lib/clsx";

  const { class: className, children, ...props }: HTMLAttributes<HTMLUListElement> = $props();
</script>

<ul class={clsx("list", className)} {...props}>
  {#if children}
    {@render children()}
  {/if}
</ul>
