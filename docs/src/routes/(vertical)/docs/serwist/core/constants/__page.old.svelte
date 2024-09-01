<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="constants">Constants</h1>
<h2 id="exported-values">Exported values</h2>
<p>
  <ICD>serwist</ICD> exports a few constants that you can make use of for more convenience. This includes:
</p>
<ul>
  <li>
    <h3 id="default-headers-to-check">BROADCAST_UPDATE_DEFAULT_HEADERS</h3>
    <p>What: the default list of headers to check.</p>
    <p>How to use:</p>
    <CodeTab codes={data.code.defaultHeadersToCheck.usage} defaultTab="sw.ts" />
  </li>
</ul>
