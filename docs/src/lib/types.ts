import type { COLOR_SCHEMES } from "./constants";

export type ColorScheme = (typeof COLOR_SCHEMES)[number];

export interface TocEntry {
  title: string;
  id: string;
  children?: TocEntry[];
}

export interface TooltipProps {
  html: string | undefined;
  x: number | undefined;
  right: boolean;
  y: number | undefined;
}
