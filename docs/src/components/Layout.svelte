<script lang="ts">
  import type { List } from "mdast";
  import type { Snippet } from "svelte";
  import Parser from "./markdown/Parser.svelte";

  interface LayoutProps {
    headings: List;
    children: Snippet;
  }

  const { headings, children }: LayoutProps = $props();
</script>

<Parser tokens={[headings]} />

{@render children()}
