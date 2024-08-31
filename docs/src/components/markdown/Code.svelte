<script lang="ts">
  import type { Code } from "mdast";
  import type { RendererProps } from "./types";

  const { value }: RendererProps<Code> = $props();
</script>

<pre><code>{value}</code></pre>
