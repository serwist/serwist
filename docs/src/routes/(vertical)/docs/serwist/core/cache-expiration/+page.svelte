<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="cache-expiration">CacheExpiration</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>Allows you to expires cached responses based on age or maximum number of entries.</p>
<h2 id="options">Options</h2>
<ul class="list">
  <li>
    <ICD>maxEntries</ICD> — The maximum number of entries to cache. Entries used (if <ICD>maxAgeFrom</ICD> is
    <ICD>{'"last-used"'}</ICD>) or fetched from the network (if <ICD>maxAgeFrom</ICD> is <ICD>{'"last-fetched"'}</ICD>) least recently will be removed
    as the maximum is reached.
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
</ul>
<h2 id="methods-and-fields">Methods and fields</h2>
<ul class="list">
  <li>
    <ICD>async expireEntries()</ICD> — Expires entries for the given cache and given criteria.
  </li>
  <li>
    <ICD>async updateTimestamp(url)</ICD> — Updates the timestamp for the given URL, allowing it to be correctly tracked by the class.
  </li>
  <li>
    <ICD>async isURLExpired(url)</ICD> — Checks if a URL has expired or not before it's used.
  </li>
  <li>
    <ICD>async delete()</ICD> — Removes the IndexedDB used to keep track of cache expiration metadata.
  </li>
</ul>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
