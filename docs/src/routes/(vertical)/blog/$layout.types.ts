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
