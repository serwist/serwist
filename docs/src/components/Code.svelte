<script lang="ts" context="module">
  import type { HTMLAttributes } from "svelte/elements";

  export interface CodeProps extends Omit<HTMLAttributes<HTMLElement>, "class"> {
    showIcon?: boolean;
  }
</script>

<script lang="ts">
  const { showIcon = false, children, ...props } = $props<CodeProps>();
</script>

<span class="flex w-fit items-center gap-2 font-mono [&>*]:min-w-[auto]">
  {#if showIcon}
    <span class="select-none text-black dark:text-white" aria-hidden="true">{">_"}</span>
  {/if}
  <code class="text-comment flex gap-2 break-all" {...props}>
    {#if children}
      {@render children()}
    {/if}
  </code>
</span>
