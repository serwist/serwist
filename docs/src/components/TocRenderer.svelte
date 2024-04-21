<script lang="ts">
  import type { TocEntry } from "$lib/types";

  interface TableOfContentsProps {
    data: TocEntry[];
  }

  const { data }: TableOfContentsProps = $props();
</script>

<ul class="list mt-2">
  {#each data as { title, id, children }}
    <li>
      <a href={`#${id}`} class="text-toc">
        {title}
      </a>
      {#if children}
        <svelte:self data={children} />
      {/if}
    </li>
  {/each}
</ul>
