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
    <div class="rounded-t-xl w-full overflow-auto flex">
      {#each codes as [tab, id]}
        {@const isActive = tab === currentTab}
        <button
          id={`${id}-button`}
          class={clsx(
            "py-2 px-4 border-gray-300 dark:border-gray-800 relative border-r-[0.5px]",
            isActive ? "bg-white text-black dark:bg-neutral-950 dark:text-white" : "text-gray-600 dark:text-gray-400"
          )}
          on:click={() => (currentTab = tab)}
          aria-controls={`${id}-code`}
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
      <div id={`${id}-code`} class="whitespace-normal" class:hidden={!isActive} aria-labelledby={`${id}-button`}>
        {#if isActive}
          <!-- Only use trusted code! -->
          {@html code}
        {/if}
      </div>
    {/each}
  </div>
</div>
