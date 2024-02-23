<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="broadcast-update-plugin">BroadcastUpdatePlugin</h1>
<br /><br />
<h2 id="first-added">First added</h2>
<br />
<p>Workbox</p>
<br /><br />
<h2 id="about">About</h2>
<br />
<p>
  A class implementing the <ICD>cacheDidUpdate</ICD> lifecycle callback. It will automatically broadcast a message whenever a cached response is updated.
</p>
<br /><br />
<h2 id="options">Options</h2>
<br />
<p>
  See
  <ICD>
    <a class="link" href="./broadcast-cache-update#options"> BroadcastCacheUpdate </a>
  </ICD>'s options.
</p>
<br /><br />
<h2 id="usage">Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
