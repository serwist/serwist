<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="cache-first">CacheFirst</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>
  An implementation of the <ExternalLink
    class="link"
    href="https://developer.chrome.com/docs/workbox/caching-strategies-overview/#cache_first_falling_back_to_network"
  >
    cache first
  </ExternalLink> request strategy.
</p>
<p>
  A cache first strategy is useful for assets that have been revisioned, such as URLs like "/styles/example.a8f5f1.css", since they can be cached for
  long periods of time.
</p>
<p>If the network request fails, and there is no cache match, this will throw a <ICD>SerwistError</ICD> exception.</p>
<h2 id="parameters">Parameters</h2>
<ul class="list">
  <li>
    <ICD>cacheName</ICD> — Cache name to store and retrieve requests. Defaults to Serwist's default cache names.
  </li>
  <li>
    <ICD>plugins</ICD> — <a class="link" href="/docs/serwist/runtime-caching/plugins">Plugins</a> to use in conjunction with this caching strategy.
  </li>
  <li>
    <ICD>fetchOptions</ICD> — Options passed to
    <ExternalLink class="link" href="https://github.com/GoogleChrome/workbox/issues/1796">non-navigation</ExternalLink>
    <ICD>fetch()</ICD> calls made by this strategy.
  </li>
  <li>
    <ICD>matchOptions</ICD> — The
    <ExternalLink class="link" href="https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions">CacheQueryOptions</ExternalLink>
    passed to any <ICD>cache.match()</ICD> or <ICD>cache.put()</ICD> call made by this strategy.
  </li>
</ul>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
<h2 id="more-resources">More resources</h2>
<p>Here is a list of resources you can read to learn more about <ICD>CacheFirst</ICD>:</p>
<ul class="list">
  <li>
    <a class="link" href="/docs/serwist/runtime-caching">Runtime caching</a>
  </li>
  <li>
    <a class="link" href="/docs/serwist/runtime-caching/plugins">Using plugins</a>
  </li>
</ul>