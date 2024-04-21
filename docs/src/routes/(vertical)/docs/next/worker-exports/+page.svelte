<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="worker-exports">Worker exports</h1>
<h2 id="introduction">Introduction</h2>
<p>
  <ICD>@serwist/next</ICD> exports a few things for the service worker to consume. These values are available at <ICD>@serwist/next/worker</ICD>.
</p>
<h2 id="exported-values">Exported values</h2>
<ul>
  <li>
    <h3 id="default-cache">defaultCache</h3>
    <p>Type: <ICD>RuntimeCaching[]</ICD></p>
    <p>What: <ICD>@serwist/next</ICD>'s recommended list of caching strategies.</p>
    <p>How to use:</p>
    <CodeTab codes={data.code.defaultCache.usage} defaultTab="app/sw.ts" />
  </li>
</ul>
