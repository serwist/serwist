import type { renderers } from "./index.js";

export type RendererProps<T> = T extends any ? Omit<T, "type"> : never;

export type RendererKey = keyof typeof renderers;
