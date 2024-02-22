import Tooltip from "$components/Tooltip.svelte";
import { mount, unmount } from "svelte";

import type { TooltipProps } from "./types";

export const setupDocsHovers = () => {
  const state = $state<TooltipProps>({
    html: undefined,
    x: undefined,
    right: false,
    y: undefined,
  });

  $effect(() => {
    let tooltip: ReturnType<typeof mount> | null;

    let timeout: NodeJS.Timeout;

    const over = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (target.tagName === "DATA-LSP") {
        clearTimeout(timeout);

        const rect = target?.getBoundingClientRect();
        const html = target?.getAttribute("lsp");
        let x = (rect.left + rect.right) / 2 + window.scrollX;
        let right = false;
        const y = rect.top + window.scrollY + 24;

        if (window.innerWidth - x < 200) {
          x = Math.max(0, window.innerWidth - rect.right);
          right = true;
        }

        if (html) {
          state.html = html;
          state.x = x;
          state.right = right;
          state.y = y;
        }

        if (!tooltip) {
          // @ts-ignore ?
          tooltip = mount(Tooltip, {
            target: document.body,
            events: {
              mouseenter() {
                clearTimeout(timeout);
              },
              mouseleave() {
                clearTimeout(timeout);
                if (tooltip) {
                  unmount(tooltip);
                  tooltip = null;
                }
              },
            },
            props: state,
          });
        }
      }
    };

    const out = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "DATA-LSP") {
        timeout = setTimeout(() => {
          if (tooltip) {
            unmount(tooltip);
            tooltip = null;
          }
        }, 500);
      }
    };

    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);

    return () => {
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
    };
  });
};
