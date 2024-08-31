<script lang="ts">
  import Parser from "./Parser.svelte";
  import type { RendererProps, Tokens } from "./types";

  const { tokens }: RendererProps<Tokens.Del> = $props();
</script>

<del>
  <Parser {tokens} />
</del>
