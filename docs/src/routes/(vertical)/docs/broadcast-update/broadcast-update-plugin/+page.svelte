<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="broadcast-update-plugin">BroadcastUpdatePlugin</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>
  A class implementing the <ICD>cacheDidUpdate</ICD> lifecycle callback. It will automatically broadcast a message whenever a cached response is updated.
</p>
<h2 id="options">Options</h2>
<p>
  See
  <a class="link" href="./broadcast-cache-update#options"><ICD>BroadcastCacheUpdate</ICD>'s options</a>.
</p>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
