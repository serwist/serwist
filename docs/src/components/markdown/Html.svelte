<script lang="ts">
  import type { RendererProps, Tokens } from "./types";

  const { text }: RendererProps<Tokens.HTML> = $props();
</script>

{text}
