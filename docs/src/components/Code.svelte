<script lang="ts" context="module">
  import type { HTMLAttributes } from "svelte/elements";

  export type CodeProps = Omit<HTMLAttributes<HTMLElement>, "class">;
</script>

<script lang="ts">
  const { children, ...props } = $props<CodeProps>();
</script>

<span class="font-mono gap-2 flex items-center w-fit">
  <span class="select-none text-black dark:text-white" aria-hidden="true">{">_"}</span>
  <code class="text-neutral-600 dark:text-neutral-400 flex break-all gap-2" {...props}>
    {#if children}
      {@render children()}
    {/if}
  </code>
</span>
