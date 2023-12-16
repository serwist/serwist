<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  type CodeProps = Omit<HTMLAttributes<HTMLElement>, "class">;

  const { children, ...props } = $props<CodeProps>();
</script>

<div class="font-mono text-sm gap-2 w-full flex items-center justify-center">
  <span class="select-none text-black dark:text-white" aria-hidden="true">{">_"}</span>
  <code class="text-neutral-600 dark:text-neutral-400 flex break-all gap-2" {...props}>
    {#if children}
      {@render children()}
    {/if}
  </code>
</div>
