export interface BlogEntry {
  title: string;
  description: string;
  date: `${string}-${string}-${string}`;
  href: string;
  keyPoints: { title: string; id: string }[];
}
