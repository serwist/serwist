<script lang="ts">
  import Callout from "$components/Callout.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>Worker exports</h1>
<h2>Why?</h2>
<p>
  <ICD>@serwist/next</ICD> exports a few things for the service worker to consume. These values cannot be exported with things that use Node.js-specific
  APIs, hence <ICD>@serwist/next/worker</ICD> was created.
</p>
<h2>Exported values</h2>
<ul>
  <li>
    <h3><ICD>defaultCache</ICD></h3>
    <p>Type: <ICD>RuntimeCaching[]</ICD></p>
    <p>What: <ICD>@serwist/next</ICD>'s recommended list of caching strategies.</p>
    <p>How to use:</p>
    <CodeTab codes={data.code.defaultCache.usage} defaultTab="app/sw.ts" />
    <Callout type="info">
      Note: you may extend the array. It is recommended that you define your entries above the defaultCache array so that they are prioritized. You
      may even filter out the default entries that share cache names with those of yours to be sure.
    </Callout>
  </li>
</ul>
