<script lang="ts">
  import type { Link } from "mdast";

  import Parser from "../Parser.svelte";
  import type { RendererProps } from "../types";

  const { url, title, children }: RendererProps<Link> = $props();
</script>

{#if url.startsWith("#")}
  <a href={url} {title} class="text-toc">
    <Parser tokens={children} />
  </a>
{:else if url.startsWith("/")}
  <a href={url} {title} class="link">
    <Parser tokens={children} />
  </a>
{:else}
  <a href={url} {title} class="link" target="_blank" rel="noopener noreferrer">
    <Parser tokens={children} />
  </a>
{/if}
