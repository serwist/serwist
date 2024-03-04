import { writable } from "svelte/store";

import type { TwoslashProps } from "$lib/types";

export const twoslashPrimitive = {
  id: undefined,
  html: undefined,
  x: undefined,
  y: undefined,
  right: false,
  bottom: false,
  maxHeight: undefined,
  closeTooltip: undefined!,
  timeout: undefined,
} satisfies TwoslashProps;

export const twoslash = writable<TwoslashProps>(twoslashPrimitive);
