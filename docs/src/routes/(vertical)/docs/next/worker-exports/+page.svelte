<script lang="ts">
  import Callout from "$components/Callout.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<h1>Worker exports</h1>
<br /><br />
<h2>Why?</h2>
<br />
<p>
  <InlineCode>@serwist/next</InlineCode> exports a few things for the service worker to consume. These values cannot be exported with things that use Node.js-specific
  APIs, hence <InlineCode>@serwist/next/worker</InlineCode> was created.
</p>
<br /><br />
<h2>Exported values</h2>
<br />
<ul>
  <li>
    <h3><InlineCode>defaultCache</InlineCode></h3>
    <br />
    <p>Type: <InlineCode>RuntimeCaching[]</InlineCode></p>
    <br />
    <p>What: the default, recommended <InlineCode>runtimeCaching</InlineCode> array of <InlineCode>@serwist/next</InlineCode>.</p>
    <br />
    <p>How to use:</p>
    <br />
    <CodeTab codes={data.code.defaultCache.usage} defaultTab="app/sw.ts" />
    <br />
    <Callout type="info">
      Note: you may extend the array. It is recommended that you define your entries above the defaultCache array so that they are prioritized. You
      may even filter out the default entries that share cache names with those of yours to be sure.
    </Callout>
  </li>
</ul>
