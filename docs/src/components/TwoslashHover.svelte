<script lang="ts">
  // TODO: Allow customizing hover timeout to be compliant with Timing Adjustable.
  import type { Snippet } from "svelte";

  import { twoslash, twoslashPrimitive } from "$lib/stores/twoslash";

  interface TooltipHoverProps {
    lsp: string;
    tpid: string;
    children: Snippet;
  }

  const { lsp, tpid, children }: TooltipHoverProps = $props();
  let span = $state<HTMLSpanElement | null>(null);
  const isActive = $derived($twoslash.id === tpid);

  const mouseEnter = () => {
    clearTimeout($twoslash.timeout);

    if (!span) return;

    const rect = span.getBoundingClientRect();
    const viewportRect = document.getElementById("root-container")!.getBoundingClientRect();
    let x = (rect.left + rect.right) / 2 + window.scrollX;
    let right = false;
    let y = Math.max(0, viewportRect.bottom - rect.y);
    let bottom = true;

    if (window.innerWidth - x < 200) {
      x = Math.max(0, window.innerWidth - rect.right);
      right = true;
    }
    if (viewportRect.bottom - y < 200) {
      y = rect.top + window.scrollY + 24;
      bottom = false;
    }

    $twoslash = {
      id: tpid,
      html: lsp,
      x,
      y,
      right,
      bottom,
      maxHeight: bottom ? rect.y : window.innerHeight - rect.y - 24,
      closeTooltip() {
        clearTimeout($twoslash.timeout);
        $twoslash = twoslashPrimitive;
      },
      timeout: undefined,
    };
  };

  const mouseLeave = () => {
    $twoslash.timeout = setTimeout($twoslash.closeTooltip, 500);
  };
</script>

<span bind:this={span} role="status" onmouseenter={mouseEnter} onmouseleave={mouseLeave} aria-describedby={isActive ? $twoslash.id : undefined}>
  {@render children()}
</span>
