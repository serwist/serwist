<script lang="ts">
  import Parser from "./Parser.svelte";
  import type { RendererProps, Tokens } from "./types";

  const { tokens }: RendererProps<Tokens.Em> = $props();
</script>

<em>
  <Parser {tokens} />
</em>
