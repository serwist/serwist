<script lang="ts">
  import type { TableOfContents } from "$lib/types";

  interface TableOfContentsProps {
    data: TableOfContents[];
  }

  const { data } = $props<TableOfContentsProps>();
</script>

<ul class="list mt-2">
  {#each data as { title, id, children }}
    <li>
      <a
        href={`#${id}`}
        class="text-toc"
      >
        {title}
      </a>
      {#if children}
        <svelte:self data={children} />
      {/if}
    </li>
  {/each}
</ul>
