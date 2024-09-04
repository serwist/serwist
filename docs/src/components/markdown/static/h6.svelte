<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import Heading from "../toc/Heading.svelte";

  const { ...props }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<Heading depth={6} {...props} />
