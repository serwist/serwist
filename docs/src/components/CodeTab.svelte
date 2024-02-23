<script lang="ts" generics="T extends [string, string, string][]">
  import { clsx } from "$lib/clsx";

  type TKeys = T[number][0];

  interface CodeTabProps {
    /**
     * Only use trusted code!
     * Map tab -> code
     */
    codes: T;
    defaultTab: TKeys;
  }

  const { codes, defaultTab } = $props<CodeTabProps>();
  let currentTab = $state(defaultTab);

  $effect(() => {
    currentTab = defaultTab;
  });
</script>

<div class="w-full rounded-xl bg-white dark:bg-neutral-950 flex flex-col border-[0.5px] border-gray-300 dark:border-gray-800">
  <div class="rounded-t-xl w-full bg-white dark:bg-black relative">
    <div role="tablist" aria-orientation="horizontal" class="rounded-t-xl w-full overflow-auto flex">
      {#each codes as [tab, id]}
        {@const isActive = tab === currentTab}
        <button
          id={`${id}-button`}
          role="tab"
          aria-controls={`${id}-code`}
          aria-selected={isActive}
          class={clsx(
            "py-2 px-4 border-gray-300 dark:border-gray-800 relative border-r-[0.5px]",
            isActive ? "bg-white text-black dark:bg-neutral-950 dark:text-white" : "text-gray-600 dark:text-gray-400"
          )}
          onclick={() => (currentTab = tab)}
        >
          {tab}
          {#if isActive}
            <span class="w-full h-[1px] z-[2] bg-white dark:bg-neutral-950 absolute bottom-0 left-0 pointer-events-none" aria-hidden="true" />
          {/if}
        </button>
      {/each}
    </div>
    <div class="w-full h-[1px] z-[1] bg-gray-300 dark:bg-gray-800 absolute bottom-0 left-0 pointer-events-none" aria-hidden="true" />
  </div>
  <div class="margin-0 p-4 overflow-auto">
    {#each codes as [tab, id, code]}
      {@const isActive = tab === currentTab}
      <div role="tabpanel" id={`${id}-code`} class="whitespace-normal" class:hidden={!isActive} aria-labelledby={`${id}-button`}>
        {#if isActive}
          <!-- Only use trusted code! -->
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html code}
        {/if}
      </div>
    {/each}
  </div>
</div>
