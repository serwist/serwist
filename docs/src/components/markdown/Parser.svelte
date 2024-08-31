<script lang="ts">
  import type { RootContent } from "mdast";
  import { renderers } from "./index.js";
  import type { RendererKey } from "./types.js";

  const { tokens }: { tokens: RootContent[] } = $props();
</script>

{#each tokens as token}
  {#if token.type in renderers}
    {@const Component = renderers[token.type as RendererKey]}
    <Component {...token as any} />
  {:else if "value" in token}
    {token.value}
  {/if}
{/each}
