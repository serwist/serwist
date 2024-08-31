<script lang="ts">
  import type { Strong } from "mdast";
  import Parser from "./Parser.svelte";
  import type { RendererProps } from "./types";

  const { children }: RendererProps<Strong> = $props();
</script>

<strong>
  <Parser tokens={children} />
</strong>
