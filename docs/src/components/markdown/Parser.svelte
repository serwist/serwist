<script lang="ts">
  import type { RootContent } from "mdast";
  import { getContext } from "svelte";

  import { getRenderer, type RendererFor } from "./index.js";

  const { tokens }: { tokens: RootContent | RootContent[] } = $props();

  const rendererFor = getContext<RendererFor | undefined>("rendererFor");
</script>

{#snippet render(token: RootContent)}
  {@const Component = getRenderer(token.type, rendererFor)}
  {#if Component}
    <Component {...token as any} />
  {:else if "value" in token}
    {token.value}
  {/if}
{/snippet}

{#if Array.isArray(tokens)}
  {#each tokens as token}
    {@render render(token)}
  {/each}
{:else}
  {@render render(tokens)}
{/if}
