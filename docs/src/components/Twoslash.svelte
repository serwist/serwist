<script lang="ts">
  import { tick } from "svelte";
  import { quintOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  import { twoslash } from "$lib/stores/twoslash";

  const { id, html, timeout, closeTooltip, right, x = 0, y = 0 } = $derived($twoslash);

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

{#if html}
  <div
    bind:this={tooltip}
    {id}
    onmouseenter={() => clearTimeout(timeout)}
    onmouseleave={closeTooltip}
    role="tooltip"
    class="twoslash-popup-container"
    style="{right ? 'right' : 'left'}:{x}px"
    style:top="{y}px"
    style:max-width="{window.innerWidth - x}px"
    style:max-height="{document.getElementById("root-container")!.getBoundingClientRect().height - y}px"
    style:--offset="{Math.min(-10, window.innerWidth - (x + width + 10))}px"
    transition:fade={{ duration: 150, easing: quintOut }}
  >
    <span class="twoslash-popup-code shiki">
      <!-- Again, only use trusted sources! -->
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html html}
    </span>
  </div>
{/if}
