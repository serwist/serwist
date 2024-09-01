<script lang="ts">
  import Callout from "$components/Callout.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="precache-fallback-plugin">PrecacheFallbackPlugin</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>
  <ICD>PrecacheFallbackPlugin</ICD> allows you to specify offline fallbacks to be used when a given strategy is unable to generate a response.
</p>
<p>
  It does this by intercepting the <ICD>handlerDidError</ICD> plugin callback and returning a precached response, taking the expected revision parameter
  into account automatically.
</p>
<Callout type="info">Generally, you don't need to use this plugin directly. Ratherly, you'd use the fallbacks option of the Serwist class.</Callout>
<h2 id="options">Options</h2>
<ul class="list">
  <li>
    <ICD>fallbackUrls</ICD> — Precached URLs to be used as the fallback if the associated strategy can't generate a response.
  </li>
  <li>
    <ICD>serwist</ICD> — Your <a class="link" href="/docs/serwist/core/serwist"><ICD>Serwist</ICD></a> instance.
  </li>
</ul>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
