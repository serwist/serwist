<script lang="ts">
  import type { Component } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import type { SVGAttributes } from "svelte/elements";

  import { clsx } from "$lib/clsx";

  import Check from "./icons/Check.svelte";
  import ExclamationMark from "./icons/ExclamationMark.svelte";
  import X from "./icons/X.svelte";

  type CalloutVariant = "error" | "success" | "warning" | "info";

  interface CalloutProps extends HTMLAttributes<HTMLSpanElement> {
    type?: CalloutVariant;
  }

  const { type = "info", children }: CalloutProps = $props();

  const mapVariantToClass = {
    parent: {
      error: "dark:bg-red-1000 bg-red-100",
      success: "bg-green-150 dark:bg-lime-1000",
      warning: "bg-yellow-75 dark:bg-yellow-1000",
      info: "bg-neutral-150 dark:bg-zinc-800",
    },
    icon: {
      error: "bg-red-650 dark:bg-red-300",
      success: "dark:bg-green-450 bg-green-700",
      warning: "bg-yellow-700 dark:bg-yellow-400",
      info: "bg-blue-550 dark:bg-blue-450",
    },
  } satisfies Record<string, Record<CalloutVariant, string>>;

  const mapVariantToIcon = {
    error: X,
    success: Check,
    warning: ExclamationMark,
    info: ExclamationMark,
  } satisfies Record<CalloutVariant, Component<SVGAttributes<SVGElement>>>;
</script>

<div
  class={clsx(
    "flex h-fit max-h-full w-full flex-row items-center gap-2 rounded-md px-3 py-2 text-base font-medium",
    "my-3 text-black md:text-sm dark:text-white [&>*]:min-w-[auto]",
    mapVariantToClass.parent[type]
  )}
>
  <span class="size-5">
    <svelte:component
      this={mapVariantToIcon[type]}
      width={20}
      height={20}
      class={clsx("rounded-full p-[2px] text-white dark:text-black", mapVariantToClass.icon[type])}
    />
  </span>
  <span class="[&>*]:!m-0">
    {#if children}
      {@render children()}
    {/if}
  </span>
</div>
