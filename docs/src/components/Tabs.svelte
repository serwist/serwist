<script lang="ts" module>
  export interface TabsState {
    id: string;
    current: string;
  }
</script>

<script lang="ts" generics="T extends string">
  import { setContext, type Snippet } from "svelte";

  import { clsx } from "$lib/clsx";

  interface TabsProps {
    id: string;
    tabs: [name: string, id: T][];
    children: Snippet;
  }

  const { id, tabs, children }: TabsProps = $props();

  let currentTab = $state(tabs[0][1]);

  $effect(() => void (currentTab = tabs[0][1]));

  setContext<TabsState>("tabsState", {
    id,
    get current() {
      return currentTab;
    },
  });
</script>

<div class="dark:bg-neutral-925 my-3 flex w-full flex-col rounded-xl border border-neutral-300 bg-white shadow-md dark:border-neutral-800">
  <div class="relative w-full rounded-t-xl bg-white dark:bg-black">
    <div role="tablist" aria-orientation="horizontal" class="flex w-full overflow-auto rounded-t-xl">
      {#each tabs as [tab, tabId]}
        {@const isActive = tabId === currentTab}
        <button
          id={`${id}-${tabId}-button`}
          role="tab"
          aria-controls={`${id}-${tabId}-code`}
          aria-selected={isActive}
          class={clsx(
            "relative min-w-max border-r border-neutral-300 px-4 py-2 dark:border-neutral-800",
            isActive ? "dark:bg-neutral-925 bg-white text-black dark:text-white" : "text-neutral-600 dark:text-neutral-400"
          )}
          onclick={() => (currentTab = tabId)}
        >
          {tab}
          {#if isActive}
            <span class="dark:bg-neutral-925 pointer-events-none absolute bottom-0 left-0 z-[2] h-[1px] w-full bg-white" aria-hidden="true"></span>
          {/if}
        </button>
      {/each}
    </div>
    <div class="pointer-events-none absolute bottom-0 left-0 z-[1] h-[1px] w-full bg-neutral-300 dark:bg-neutral-800" aria-hidden="true"></div>
  </div>
  <div class="margin-0 overflow-auto p-4">
    {@render children()}
  </div>
</div>
