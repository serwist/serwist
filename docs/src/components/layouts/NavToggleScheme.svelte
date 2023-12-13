<script lang="ts">
  import MoonStars from "$components/icons/MoonStars.svelte";
  import Sun from "$components/icons/Sun.svelte";
  import { clsx } from "$lib/clsx";
  import { colorScheme, toggleColorScheme } from "$lib/stores/colorScheme";

  const isDark = $derived($colorScheme === "dark");

  const { deviceType } = $props<{
	deviceType: "mobile" | "desktop"
  }>();

  const mapDeviceTypeToClass = {
    desktop: "hidden md:flex",
    mobile: "flex",
  };
</script>

<button
  on:click={() => toggleColorScheme()}
  class={clsx(
    "transition-colors_opa h-7 w-7 cursor-pointer items-center justify-center rounded-[4px] border bg-transparent duration-100",
    mapDeviceTypeToClass[deviceType],
    isDark ? "border-sky-400 text-sky-400 hover:bg-sky-600/[0.2]" : "border-yellow-500 text-yellow-500 hover:bg-yellow-200/[0.6]"
  )}
  aria-label="Toggle color scheme"
>
  {#if isDark}
    <MoonStars width={18} height={18} />
  {:else}
    <Sun width={18} height={18} />
  {/if}
</button>
