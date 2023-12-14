<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { clsx } from "$lib/clsx";

  type CodeProps = Omit<HTMLAttributes<HTMLElement>, "class">;

  const { children, ...props } = $props<CodeProps>();
</script>

<code
  class={clsx(
    "my-6 break-words rounded-md px-[.25em] py-0.5 text-[.9em]",
    "border border-black border-opacity-[0.1] dark:border-white/10 dark:border-opacity-[0.04]"
  )}
  {...props}
>
  {#if children}
    {@render children()}
  {/if}
</code>
