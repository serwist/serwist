<script lang="ts">
  import type { Paragraph } from "mdast";

  import Parser from "./Parser.svelte";
  import type { RendererProps } from "./types";

  const { children }: RendererProps<Paragraph> = $props();
</script>

<p class="mb-4">
  <Parser tokens={children} />
</p>
