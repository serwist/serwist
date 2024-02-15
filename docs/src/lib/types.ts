import type { COLOR_SCHEMES } from "./constants";

export type ColorScheme = (typeof COLOR_SCHEMES)[number];

export interface TableOfContents {
  title: string;
  id: string;
  children?: TableOfContents[];
}
