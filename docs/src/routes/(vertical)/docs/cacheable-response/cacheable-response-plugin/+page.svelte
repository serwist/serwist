<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="cacheable-response-plugin">CacheableResponsePlugin</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>
  A class implementing the <ICD>cacheWillUpdate</ICD> lifecycle callback. This makes it easier to add in cacheability checks to requests made via Serwist's
  built-in strategies.
</p>
<h2 id="options">Options</h2>
<p>
  See <a class="link" href="./cacheable-response#options"><ICD>CacheableResponse</ICD>'s options</a>.
</p>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
