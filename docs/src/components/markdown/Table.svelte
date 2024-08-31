<script lang="ts">
  import type { Table } from "mdast";
  import TableCell from "./TableCell.svelte";
  import type { RendererProps } from "./types";

  const { header, rows }: RendererProps<Table> = $props();
</script>

<div class="w-full overflow-x-auto">
  <table class="table-auto border-collapse border-spacing-4">
    <thead>
      <tr>
        {#each header as headerItem}
          <TableCell {...headerItem} />
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          {#each row as cell}
            <TableCell {...cell} />
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
