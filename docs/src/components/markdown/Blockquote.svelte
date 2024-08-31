<script lang="ts">
  import Parser from "./Parser.svelte";
  import type { RendererProps, Tokens } from "./types";

  const { tokens }: RendererProps<Tokens.Blockquote> = $props();
</script>

<blockquote class="text-comment border-l-2 border-neutral-600 px-4 mb-4 dark:border-neutral-400 [&>:first-child]:!mt-0 [&>:last-child]:!mb-0">
  <Parser {tokens} />
</blockquote>
