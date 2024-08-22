<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  import { clsx } from "$lib/clsx";

  import Check from "./icons/Check.svelte";
  import ExclamationMark from "./icons/ExclamationMark.svelte";
  import X from "./icons/X.svelte";

  type CalloutVariant = "error" | "success" | "warning" | "info";

  interface CalloutProps extends HTMLAttributes<HTMLSpanElement> {
    type?: CalloutVariant;
  }

  const { type = "info", children }: CalloutProps = $props();

  const barColor = $derived.by(() => {
    switch (type) {
      case "error":
        return "dark:bg-red-1000 bg-red-100";
      case "success":
        return "bg-green-150 dark:bg-lime-1000";
      case "warning":
        return "bg-yellow-75 dark:bg-yellow-1000";
      case "info":
        return "bg-neutral-150 dark:bg-zinc-800";
    }
  });

  const Icon = $derived.by(() => {
    switch (type) {
      case "error":
        return X;
      case "success":
        return Check;
      case "warning":
        return ExclamationMark;
      case "info":
        return ExclamationMark;
    }
  });

  const iconColor = $derived.by(() => {
    switch (type) {
      case "error":
        return "bg-red-650 dark:bg-red-300";
      case "success":
        return "dark:bg-green-450 bg-green-700";
      case "warning":
        return "bg-yellow-700 dark:bg-yellow-400";
      case "info":
        return "bg-blue-550 dark:bg-blue-450";
    }
  });
</script>

<div
  class={clsx(
    "flex h-fit max-h-full w-full flex-row items-center gap-2 rounded-md px-3 py-2 text-base font-medium",
    "my-3 border border-neutral-300 text-black shadow-md md:text-sm dark:border-neutral-800 dark:text-white [&>*]:min-w-[auto]",
    barColor
  )}
>
  <span class="size-5">
    <Icon width={20} height={20} class={clsx("rounded-full p-[2px] text-white dark:text-black", iconColor)} />
  </span>
  <span class="[&>*]:!m-0">
    {#if children}
      {@render children()}
    {/if}
  </span>
</div>
