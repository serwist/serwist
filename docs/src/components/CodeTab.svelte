<script lang="ts" generics="T extends string">
  import { clsx } from "$lib/clsx";

  interface CodeTabProps {
    /**
     * Only use trusted code!
     * Map tab -> code
     */
    codes: Record<T, string>;
    idPrefix: string;
    defaultTab: T;
  }

  const { codes, idPrefix, defaultTab } = $props<CodeTabProps>();

  const codeEntries = $derived(Object.entries(codes) as [T, string][]);
  const codeKeys = $derived(codeEntries.map(([key]) => key));

  let currentTab = $state(defaultTab);

  $effect(() => {
    currentTab = defaultTab;
  });
</script>

<div class="w-full rounded-xl bg-neutral-50 dark:bg-neutral-950 flex flex-col overflow-hidden border-[0.5px] border-gray-300 dark:border-gray-800">
  <div class="w-full bg-white dark:bg-black relative flex">
    {#each codeKeys as tab}
      {@const isActive = tab === currentTab}
      <button
        id={`${idPrefix}-${tab}-button`}
        class={clsx(
          "py-2 px-4 border-gray-300 dark:border-gray-800 relative border-r-[0.5px]",
          isActive ? "bg-neutral-50 text-black dark:bg-neutral-950 dark:text-white" : "text-gray-600 dark:text-gray-400"
        )}
        on:click={() => (currentTab = tab)}
        aria-controls={`${idPrefix}-${tab}-code`}
      >
        {tab}
        {#if isActive}
          <span class="w-full h-[1px] z-[2] bg-neutral-50 dark:bg-neutral-950 absolute bottom-0 left-0 pointer-events-none" aria-hidden="true" />
        {/if}
      </button>
    {/each}
    <div class="w-full h-[1px] z-[1] bg-gray-300 dark:bg-gray-800 absolute bottom-0 left-0 pointer-events-none" aria-hidden="true" />
  </div>
  <div class="margin-0 p-4">
    {#each codeEntries as [tab, code]}
      {@const isActive = tab === currentTab}
      <pre
        id={`${idPrefix}-${tab}-code`}
        class={clsx("whitespace-normal overflow-auto", !isActive && "hidden")}
        aria-labelledby={`${idPrefix}-${tab}-button`}>
        <!-- Only use trusted code! -->
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        <code class="block w-fit whitespace-pre">{@html code}</code>
      </pre>
    {/each}
  </div>
</div>
