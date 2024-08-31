<script lang="ts">
  import type { List } from "mdast";
  import ListItem from "./ListItem.svelte";
  import type { RendererProps } from "./types";

  const { ordered, children, start }: RendererProps<List> = $props();
</script>

{#if ordered}
  <ol class="list" start={start || null}>
    {#each children as item}
      <ListItem {...item} />
    {/each}
  </ol>
{:else}
  <ul class="list">
    {#each children as item}
      <ListItem {...item} />
    {/each}
  </ul>
{/if}
