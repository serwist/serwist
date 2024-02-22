<script lang="ts" context="module">
  export interface TooltipProps {
    html: string | undefined;
    x: number | undefined;
    y: number | undefined;
  }
</script>

<script lang="ts">
  import { tick } from "svelte";

  const { html = "", x = 0, y = 0 } = $props<TooltipProps>();

  let width = $state(1);

  let tooltip = $state<HTMLDivElement | null>(null);

  $effect(() => {
    if (html) {
      tick().then(() => {
        if (tooltip) {
          width = tooltip.getBoundingClientRect().width;
        }
      });
    }
  });
</script>

<div
  bind:this={tooltip}
  on:mouseenter
  on:mouseleave
  role="tooltip"
  class="twoslash-popup-container"
  style:left="{x}px"
  style:top="{y}px"
  style:max-width="{window.innerWidth - x}px"
  style:max-height="{document.getElementById("root-container")!.getBoundingClientRect().height - y}px"
  style:--offset="{Math.min(-10, window.innerWidth - (x + width + 10))}px"
>
  <span class="twoslash-popup-code shiki">
    <!-- Again, only use trusted sources! -->
    {@html html}
  </span>
</div>
