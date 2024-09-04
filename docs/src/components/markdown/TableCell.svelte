<script lang="ts">
  import type { TableCell } from "mdast";
  import Parser from "./Parser.svelte";
  import type { RendererProps } from "./types";

  const { children }: RendererProps<TableCell> = $props();
</script>

<td class="dark:bg-neutral-915 border-border-light dark:border-border-dark border bg-white px-2 py-1 transition-colors duration-100">
  <Parser tokens={children} />
</td>
