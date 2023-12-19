<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { clsx } from "$lib/clsx";

  type HeadingElement = "h1" | "h2" | "h3" | "h4";
  type HeadingVariant = "default" | "error";
  type HeadingType = "subtitle" | "title" | "title-large" | "display";

  const mapTypeToComponent: Record<
    HeadingType,
    {
      element: HeadingElement;
      className?: string;
    }
  > = {
    subtitle: {
      element: "h4",
      className: "leading-5 text-base tracking-tight",
    },
    title: {
      element: "h3",
      className: "leading-7 text-2xl tracking-tight",
    },
    "title-large": {
      element: "h2",
      className: "leading-7 text-3xl font-semibold tracking-tight",
    },
    display: {
      element: "h1",
      className: "leading-10 text-4xl font-semibold tracking-tight",
    },
  };

  const mapVariantToClass: Record<HeadingVariant, string> = {
    default: "text-black dark:text-white",
    error: "text-red-500 dark:text-red-400",
  };

  interface HeadingProps extends Omit<HTMLAttributes<HTMLHeadingElement>, "class"> {
    variant?: HeadingVariant;
    type?: HeadingType;
    screenReaderOnly?: boolean;
  }

  const { variant = "default", type = "title", screenReaderOnly = false, children, ...props } = $props<HeadingProps>();

  const mappedComponent = $derived(mapTypeToComponent[type]);
  const mappedVariant = $derived(mapVariantToClass[variant]);
</script>

<svelte:element
  this={mappedComponent.element}
  class={clsx("break-words", mappedVariant, screenReaderOnly && "sr-only", mappedComponent.className)}
  {...props}
>
  {#if children}
    {@render children()}
  {/if}
</svelte:element>
