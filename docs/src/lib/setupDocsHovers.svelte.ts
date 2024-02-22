import { mount, unmount } from "svelte";
import Tooltip from "$components/Tooltip.svelte";

export const setupDocsHovers = () => {
  const state = $state<{ html: string | undefined; x: number | undefined; y: number | undefined }>({
    html: undefined,
    x: undefined,
    y: undefined,
  });

  $effect(() => {
    let tooltip: ReturnType<typeof mount> | null;

    let timeout: NodeJS.Timeout;

    const over = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (target.tagName === "DATA-LSP") {
        clearTimeout(timeout);

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

        const rect = target?.getBoundingClientRect();
        const html = target?.getAttribute("lsp");

        const x = (rect.left + rect.right) / 2 + window.scrollX;
        const y = rect.top + window.scrollY + 24;

        if (html) {
          state.html = html;
          state.x = x;
          state.y = y;
        }
      }
    }

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
    }

    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);

    return () => {
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
    };
  });
}
