<script lang="ts">
  import type { ListItem } from "mdast";

  import Parser from "./Parser.svelte";
  import type { RendererProps } from "./types";

  const { children }: RendererProps<ListItem> = $props();
</script>

<li class="mb-2 [&>ol]:mt-2 [&>ul]:mt-2">
  <Parser tokens={children} />
</li>
