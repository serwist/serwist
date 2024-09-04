<script lang="ts">
  import { getContext } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import type { TocObserver } from "$lib/TocObserver.svelte";
  import type { HeadingLevel } from "$lib/types";

  interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
    depth: HeadingLevel;
  }

  const { depth, children, ...props }: HeadingProps = $props();

  let toc = $state<HTMLHeadingElement | null>(null);

  const tocObserver = getContext<TocObserver>("tocObserver");

  $effect(() => {
    if (toc) tocObserver.observe(toc);

    return () => toc && tocObserver.unobserve(toc);
  });
</script>

<svelte:element this={`h${depth}`} bind:this={toc} {...props}>
  {#if children}
    {@render children()}
  {/if}
</svelte:element>
