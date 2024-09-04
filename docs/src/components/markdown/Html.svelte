<script lang="ts">
  import type { Html } from "mdast";
  import type { RendererProps } from "./types";

  const { value }: RendererProps<Html> = $props();
</script>

{value}
