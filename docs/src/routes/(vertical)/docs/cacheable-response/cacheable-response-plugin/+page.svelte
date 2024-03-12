<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="cacheable-response-plugin">CacheableResponsePlugin</h1>
<br /><br />
<h2 id="first-added">First added</h2>
<br />
<p>Workbox</p>
<br /><br />
<h2 id="about">About</h2>
<br />
<p>
  A class implementing the <ICD>cacheWillUpdate</ICD> lifecycle callback. This makes it easier to add in cacheability checks to requests made via Serwist's
  built-in strategies.
</p>
<br /><br />
<h2 id="options">Options</h2>
<br />
<p>
  See <a class="link" href="./cacheable-response#options"><ICD>CacheableResponse</ICD>'s options</a>.
</p>
<br /><br />
<h2 id="usage">Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
