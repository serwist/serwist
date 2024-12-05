<script lang="ts" module>
  import TwoslashHover from "$components/TwoslashHover.svelte";
  import { a, code, h1, h2, h3, h4, h5, h6, ul } from "../markdown/static";

  export { a, code, h1, h2, h3, h4, h5, h6, ul, TwoslashHover };
</script>

<script lang="ts">
  import type { List } from "mdast";
  import { setContext, type Snippet } from "svelte";

  import { TocObserver } from "$lib/TocObserver.svelte";

  import Toc from "../Toc.svelte";

  interface LayoutProps {
    headings: List;
    children: Snippet;
  }

  const { headings, children }: LayoutProps = $props();

  const tocObserver = setContext("tocObserver", new TocObserver());

  $effect(() => {
    return () => tocObserver.disconnect();
  });
</script>

<main id="main-content" class="flex w-full flex-col xl:flex-row xl:justify-between">
  <nav
    class="top-0 shrink-0 px-6 pt-6 md:px-12 xl:sticky xl:order-last xl:max-h-dvh xl:w-[350px] xl:px-4 print:hidden"
    aria-label="Table of contents"
  >
    <Toc {headings} />
  </nav>
  <article class="prose flex w-full max-w-6xl flex-col p-6 md:px-12 md:pb-12 xl:pt-12">
    {@render children()}
  </article>
</main>
