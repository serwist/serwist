<script lang="ts">
  import { tick } from "svelte";
  import { quintOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  import { hotkeys } from "$lib/hotkeys.svelte";
  import { twoslash } from "$lib/stores/twoslash";

  const id = $derived($twoslash.id);
  const html = $derived($twoslash.html);
  const x = $derived($twoslash.x ?? 0);
  const y = $derived($twoslash.y ?? 0);
  const right = $derived($twoslash.right);
  const bottom = $derived($twoslash.bottom);
  const maxHeight = $derived($twoslash.maxHeight);
  const closeTooltip = $derived($twoslash.closeTooltip);
  const timeout = $derived($twoslash.timeout);
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

  hotkeys([["alt+q", () => html && closeTooltip()]]);
</script>

{#if html}
  <div
    bind:this={tooltip}
    {id}
    onmouseenter={() => clearTimeout(timeout)}
    onmouseleave={closeTooltip}
    role="tooltip"
    class="twoslash-popup-container"
    style="{right ? 'right' : 'left'}:{x}px;{bottom ? 'bottom' : 'top'}:{y}px"
    style:max-width="{window.innerWidth - x}px"
    style:max-height="{maxHeight}px"
    style:--offset="{Math.min(-10, window.innerWidth - (x + width + 10))}px"
    transition:fade={{ duration: 150, easing: quintOut }}
  >
    <p class="sr-only">Press Alt+Q to dismiss this tooltip.</p>
    <span class="twoslash-popup-code">
      <!-- Again, only use trusted sources! -->
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html html}
    </span>
  </div>
{/if}
