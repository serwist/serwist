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

  const { codes, defaultTab }: CodeTabProps = $props();
  let currentTab = $state(defaultTab);

  $effect(() => {
    currentTab = defaultTab;
  });
</script>

<div class="my-3 flex w-full flex-col rounded-xl border border-neutral-300 bg-white dark:border-neutral-800 shadow-md dark:bg-neutral-925">
  <div class="relative w-full rounded-t-xl bg-white dark:bg-black">
    <div role="tablist" aria-orientation="horizontal" class="flex w-full overflow-auto rounded-t-xl">
      {#each codes as [tab, id]}
        {@const isActive = tab === currentTab}
        <button
          id={`${id}-button`}
          role="tab"
          aria-controls={`${id}-code`}
          aria-selected={isActive}
          class={clsx(
            "relative min-w-max border-r border-neutral-300 px-4 py-2 dark:border-neutral-800",
            isActive ? "bg-white text-black dark:bg-neutral-925 dark:text-white" : "text-neutral-600 dark:text-neutral-400"
          )}
          onclick={() => (currentTab = tab)}
        >
          {tab}
          {#if isActive}
            <span class="pointer-events-none absolute bottom-0 left-0 z-[2] h-[1px] w-full bg-white dark:bg-neutral-925" aria-hidden="true"></span>
          {/if}
        </button>
      {/each}
    </div>
    <div class="pointer-events-none absolute bottom-0 left-0 z-[1] h-[1px] w-full bg-neutral-300 dark:bg-neutral-800" aria-hidden="true"></div>
  </div>
  <div class="margin-0 overflow-auto p-4">
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
