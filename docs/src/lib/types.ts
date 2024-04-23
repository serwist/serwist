import type { COLOR_SCHEMES } from "./constants";

export type ColorScheme = (typeof COLOR_SCHEMES)[number];

export interface TocEntry {
  title: string;
  id: string;
  children?: TocEntry[];
}

export interface TwoslashProps {
  id: string | undefined;
  html: string | undefined;
  x: number | undefined;
  y: number | undefined;
  right: boolean;
  bottom: boolean;
  maxHeight: number | undefined;
  closeTooltip(): void;
  timeout: NodeJS.Timeout | undefined;
}

export type OpenGraphImage =
  | string
  | {
      title: string;
      desc: string;
    };

export interface SidebarLink {
  title: string;
  href: string;
  children?: SidebarLink[];
}

export interface BlogEntry {
  href: string;
  title: {
    content: string;
    id: string;
  };
  description: string;
  date: `${string}-${string}-${string}`;
  keyPoints: { title: string; id: string }[];
}
