<script lang="ts">
  import type { CodeProps } from "./Code.svelte";

  const { showIcon = false, children, ...props }: CodeProps = $props();
</script>

<span class="text-comment inline-flex w-fit items-center gap-2 font-mono [&>*]:min-w-[auto]">
  {#if showIcon}
    <span class="select-none text-black dark:text-white" aria-hidden="true">{">_"}</span>
  {/if}
  <code class="flex gap-2 break-all" {...props}>
    {#if children}
      {@render children()}
    {/if}
  </code>
</span>
