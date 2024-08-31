<script lang="ts">
  import type { RendererProps, Tokens } from "./types";

  const { text }: RendererProps<Tokens.Codespan> = $props();
</script>

<code class="text-comment break-all font-mono">
  {text}
</code>
