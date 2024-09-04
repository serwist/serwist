<script lang="ts">
  import { getContext, type Snippet } from "svelte";

  import type { TabsState } from "./Tabs.svelte";

  const tabs = getContext<TabsState>("tabsState");

  interface TabProps {
    id: string;
    children: Snippet;
  }

  const { id, children }: TabProps = $props();

  const isActive = $derived(tabs.current === id);
</script>

<div role="tabpanel" id={`${tabs.id}-${id}-code`} class="whitespace-normal" class:hidden={!isActive} aria-labelledby={`${tabs.id}-${id}-button`}>
  {#if isActive}
    {@render children()}
  {/if}
</div>
