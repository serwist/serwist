<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { clsx } from "$lib/clsx";

  type TextVariant = "default" | "error";

  interface TextProps extends Omit<HTMLAttributes<HTMLParagraphElement>, "class"> {
    variant?: TextVariant;
  }

  const { variant = "default", children, ...props } = $props<TextProps>();

  const mapVariantToClass: Record<TextVariant, string> = {
    default: "text-black dark:text-white",
    error: "text-red-500 dark:text-red-400",
  };

  const mappedVariant = $derived(mapVariantToClass[variant]);
</script>

<p class={clsx("break-words", mappedVariant)} {...props}>
  {#if children}
    {@render children()}
  {/if}
</p>
