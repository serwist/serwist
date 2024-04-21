<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ETL from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="network-only">NetworkOnly</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>
  An implementation of the <ETL
    class="link"
    href="https://developer.chrome.com/docs/workbox/caching-strategies-overview/#network_only"
  >
    network only
  </ETL> request strategy.
</p>
<p>
  This class is useful if you require specific requests to only be fulfilled from the network.
</p>
<p>If the network request fails, this will throw a <ICD>SerwistError</ICD> exception.</p>
<h2 id="parameters">Parameters</h2>
<ul class="list">
  <li>
    <ICD>plugins</ICD> — <a class="link" href="/docs/serwist/runtime-caching/plugins">Plugins</a> to use in conjunction with this caching strategy.
  </li>
  <li>
    <ICD>fetchOptions</ICD> — Options passed to
    <ETL class="link" href="https://github.com/GoogleChrome/workbox/issues/1796">non-navigation</ETL>
    <ICD>fetch()</ICD> calls made by this strategy.
  </li>
  <li>
    <ICD>networkTimeoutSeconds</ICD> — If set, any network requests that fail to respond within the timeout will fallback to the cache.
  </li>
</ul>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
<h2 id="more-resources">More resources</h2>
<p>Here is a list of resources you can read to learn more about <ICD>NetworkOnly</ICD>:</p>
<ul class="list">
  <li>
    <a class="link" href="/docs/serwist/runtime-caching">Runtime caching</a>
  </li>
  <li>
    <a class="link" href="/docs/serwist/runtime-caching/plugins">Using plugins</a>
  </li>
</ul>
