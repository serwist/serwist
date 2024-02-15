<script lang="ts">
  import { clsx } from "$lib/clsx";
  import type { TableOfContents } from "$lib/types";

  interface TableOfContentsProps {
    data: TableOfContents[];
    currentActiveId: string;
  }

  const { data, currentActiveId } = $props<TableOfContentsProps>();
</script>

<ul class="list mt-2">
  {#each data as { title, id, children }}
    {@const isActive = currentActiveId === id}
    <li>
      <a
        href={`#${id}`}
        class={clsx("text-toc", isActive ? "active" : "inactive")}
      >
        {title}
      </a>
      {#if children}
        <svelte:self data={children} currentActiveId={currentActiveId} />
      {/if}
    </li>
  {/each}
</ul>
