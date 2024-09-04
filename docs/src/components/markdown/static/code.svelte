<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import InlineCode from "$components/InlineCode.svelte";

  const { ...props }: HTMLAttributes<HTMLElement> = $props();
</script>

<InlineCode {...props} />
