<svelte:options customElement="data-lsp" />

<script lang="ts">
  import { twoslash } from "$lib/stores/twoslash";

  interface TooltipHoverProps {
    lsp: string;
    tpid: string;
  }

  const { lsp, tpid } = $props<TooltipHoverProps>();

  let span = $state<HTMLSpanElement | null>(null);

  const mouseOver = () => {
    clearTimeout($twoslash.timeout);

    if (!span) return;

    const rect = span.getBoundingClientRect();
    let x = (rect.left + rect.right) / 2 + window.scrollX;
    let right = false;
    const y = rect.top + window.scrollY + 24;

    if (window.innerWidth - x < 200) {
      x = Math.max(0, window.innerWidth - rect.right);
      right = true;
    }

    $twoslash = {
      id: tpid,
      html: lsp,
      right,
      x,
      y,
      closeTooltip() {
        clearTimeout($twoslash.timeout);
        $twoslash.html = undefined;
        span?.removeAttribute("aria-describedby");
      },
      timeout: undefined,
    };

    span.setAttribute("aria-describedby", tpid);
  };

  const mouseOut = () => {
    $twoslash.timeout = setTimeout($twoslash.closeTooltip, 500);
  };
</script>

<span bind:this={span} class="twoslash-hover" role="status" onmouseover={mouseOver} onmouseout={mouseOut} onfocus={mouseOver} onblur={mouseOut}>
  <slot />
</span>

<style>
  .twoslash-hover {
    border-bottom: 1px dotted transparent;
    transition: border-color 0.3s linear;
  }

  .twoslash-hover:hover {
    border-color: currentColor;
  }
</style>
