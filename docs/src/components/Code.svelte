<script lang="ts" context="module">
  import type { HTMLAttributes } from "svelte/elements";

  export interface CodeProps extends Omit<HTMLAttributes<HTMLElement>, "class"> {
    showIcon?: boolean;
  }
</script>

<script lang="ts">
  const { showIcon = false, children, ...props } = $props<CodeProps>();
</script>

<span class="font-mono gap-2 flex items-center w-fit">
  {#if showIcon}
    <span class="select-none text-black dark:text-white" aria-hidden="true">{">_"}</span>
  {/if}
  <code class="text-neutral-600 dark:text-neutral-400 flex break-all gap-2" {...props}>
    {#if children}
      {@render children()}
    {/if}
  </code>
</span>
