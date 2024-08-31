<script lang="ts">
  import type { ListItem } from "mdast";
  import type { RendererProps } from "./types";
  import Parser from "./Parser.svelte";

  const { children }: RendererProps<ListItem> = $props();
</script>

<li class="mb-2 [&>ol]:mt-2 [&>ul]:mt-2">
  <Parser tokens={children} />
</li>
