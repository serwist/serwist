<script lang="ts">
  import type { Literal } from "mdast";

  import type { RendererProps } from "./types";

  const { value }: RendererProps<Literal> = $props();
</script>

{value}
