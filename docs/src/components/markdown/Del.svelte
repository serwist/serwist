<script lang="ts">
  import type { Delete } from "mdast";
  import Parser from "./Parser.svelte";
  import type { RendererProps } from "./types";

  const { children }: RendererProps<Delete> = $props();
</script>

<del>
  <Parser tokens={children} />
</del>
