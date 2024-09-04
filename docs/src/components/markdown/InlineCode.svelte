<script lang="ts">
  import type { InlineCode } from "mdast";

  import Code from "$components/InlineCode.svelte";

  import type { RendererProps } from "./types";

  const { value }: RendererProps<InlineCode> = $props();
</script>

<Code>{value}</Code>
