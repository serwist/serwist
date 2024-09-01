<script lang="ts">
  import InlineCode from "$components/InlineCode.svelte";
  import type { HTMLAttributes } from "svelte/elements";

  const { ...props }: HTMLAttributes<HTMLElement> = $props();
</script>

<InlineCode {...props} />
