<script>
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="setting-cacheability-criteria">Setting cacheability criteria</h1>
<a href="https://developer.chrome.com/docs/workbox/modules/workbox-cacheable-response" class="link" target="_blank" rel="noreferrer">
  Original source (Apache 2.0 License). Adapted for Serwist's usage.
</a>
<h2 id="introduction">Introduction</h2>
<p>
  When caching assets at runtime, there's no one-size-fits-all rule for whether a given response is "valid" and eligible for being saved and reused.
</p>
<p>
  Serwist provides plugins designed to help determine whether a response should be cached based on its numeric status code, the presence of a header
  with a specific value, or a combination of the two.
</p>
<h2 id="the-defaults">The defaults</h2>
<p>
  If you use one of Serwist's built-in strategies without explicitly configuring
  <ICD>CacheableResponsePlugin</ICD>, the following default criteria is used to determine whether a response received from the network should be
  cached:
</p>
<ul class="list">
  <li>
    <ICD>StaleWhileRevalidate</ICD> and <ICD>NetworkFirst</ICD>: Responses with a status of 0 (i.e. opaque responses) or 200 are considered cacheable.
  </li>
  <li><ICD>CacheFirst</ICD>: Responses with a status of 200 are considered cacheable.</li>
</ul>
<h3 id="why-are-there-different-defaults">Why are there different defaults?</h3>
<p>
  The defaults vary around whether responses with a status of 0 (i.e. opaque responses) will end up cached. Due to the "black box" nature of opaque
  responses, it's not possible for the service worker to know whether the response is valid, or whether it reflects an error response returned from
  the cross-origin server.
</p>
<p>
  For strategies that include some means of updating the cached response, like <ICD>StaleWhileRevalidate</ICD> and <ICD>NetworkFirst</ICD>, the risk
  of caching a transient error response is mitigated by the fact that the next time the cache is updated, a proper, successful response will hopefully
  be used.
</p>
<p>
  For strategies that involve caching the first response received and reusing that cached response indefinitely, the repercussions of a transient
  error getting cached and reused are more severe. To be on the safe side, CacheFirst refuses to save a response unless it has a status code of 200 by
  default.
</p>
<h2 id="basic-usage">Basic usage</h2>
<p>The easiest way to use this module is to use the plugin, which automatically determines whether a response can be cached.</p>
<CodeTab codes={data.code.basicUsage} defaultTab="sw.ts" />
<h2 id="advanced-usage">Advanced usage</h2>
<p>
  If you want to use the same caching logic outside of a Serwist strategy, you can use the <ICD>CacheableResponse</ICD> class directly.
</p>
<CodeTab codes={data.code.advancedUsage} defaultTab="sw.ts" />
