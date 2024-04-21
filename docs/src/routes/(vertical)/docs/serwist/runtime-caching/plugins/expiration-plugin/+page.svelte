<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="expiration-plugin">ExpirationPlugin</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>
  This plugin can be used in a <a class="link" href="/docs/strategies/runtime-caching/caching-strategies/strategy"><ICD>Strategy</ICD></a> to regularly
  enforce a limit on the age and/or the number of cached requests.
</p>
<p>
  It can only be used with <ICD>Strategy</ICD> instances that have a custom <ICD>cacheName</ICD> property set. In other words, it can't be used to expire
  entries in strategies that use the default runtime cache name.
</p>
<p>Whenever a cached response is used or updated, this plugin will look at the associated cache and remove any old or extra responses.</p>
<p>
  When using <ICD>maxAgeSeconds</ICD>, responses may be used once after being expired because the expiration clean up does not occur until after the
  cached response has been used. If the response has a "Date" header, then a lightweight expiration check is performed, and the response will not be
  used immediately.
</p>
<p>When using <ICD>maxEntries</ICD>, the least recently requested entry will be removed from the cache.</p>
<h2 id="options">Options</h2>
<ul class="list">
  <li>
    <ICD>maxEntries</ICD> — The maximum number of entries to cache. Entries used least recently will be removed as the maximum is reached.
  </li>
  <li>
    <ICD>maxAgeSeconds</ICD> — The maximum age of an entry before it's treated as stale and removed.
  </li>
  <li>
    <ICD>matchOptions</ICD> — The
    <a class="link" target="_blank" rel="noreferrer" href="https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete#Parameters">
      <ICD>CacheQueryOptions</ICD>
    </a>
    that will be used when calling <ICD>delete()</ICD> on the cache.
  </li>
  <li>
    <ICD>purgeOnQuotaError</ICD> — Whether to opt this cache into automatic deletion if the available storage quota has been exceeded.
  </li>
</ul>
<h2 id="methods-and-fields">Methods and fields</h2>
<ul class="list">
  <li>
    <ICD>async deleteCacheAndMetadata()</ICD> — Deletes the underlying <ICD>Cache</ICD> instance associated with this instance and the metadata from IndexedDB
    used to keep track of expiration details.
  </li>
</ul>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
