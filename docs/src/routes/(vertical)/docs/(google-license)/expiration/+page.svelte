<script>
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="serwist-expiration">@serwist/expiration</h1>
<br />
<a href="https://developer.chrome.com/docs/workbox/modules/workbox-expiration" class="link" target="_blank" rel="noreferrer">
  Original source (Apache 2.0 License). Adapted for Serwist's usage.
</a>
<br /><br />
<h2 id="introduction">Introduction</h2>
<br />
<p>
  <ICD>@serwist/expiration</ICD> is a module that expires cached responses based on age or maximum number of entries.
</p>
<br />
<p>
  It's fairly common to want to put restrictions on a cache in terms of how long it should allow items to be stored in a cache or how many items
  should be kept in a cache. Serwist provides this functionality through this module, which allows you to limit the number of entries in a cache
  and/or remove entries that have been cached for a long period of time.
</p>
<br /><br />
<h2 id="basic-usage">Basic usage</h2>
<br />
<h3 id="restrict-the-number-of-cache-entries">Restrict the number of cache entries</h3>
<br />
<p>
  To restrict the number of entries stored in a cache, you can use the
  <ICD>maxEntries</ICD> option like so:
</p>
<br />
<CodeTab codes={data.code.basicUsage.maxEntries} defaultTab="sw.ts" />
<br />
<p>
  After a cached response is used or a new request is added to the cache, the plugin will look at the configured cache and ensure that the number of
  cached entries doesn't exceed the limit. If it does, the oldest entries will be removed.
</p>
<br />
<h3 id="restrict-the-age-of-cached-entries">Restrict the age of cached entries</h3>
<br />
<p>
  To restrict how long a request is cached for, you can define a max age in seconds using the <ICD>maxAgeSeconds</ICD> option like so:
</p>
<br />
<CodeTab codes={data.code.basicUsage.maxAgeSeconds} defaultTab="sw.ts" />
<br />
<p>The plugin will check and remove entries after each request or cache update.</p>
<br /><br />
<h2 id="advanced-usage">Advanced usage</h2>
<br />
<p>
  If you'd like to use the expiration logic separate from any other Serwist module, you can do so with the <ICD>CacheExpiration</ICD> class.
</p>
<br />
<p>
  To apply restrictions to a cache, you'd create an instance of
  <ICD>CacheExpiration</ICD> for the cache you want to control like so:
</p>
<br />
<CodeTab codes={data.code.advancedUsage.setup} defaultTab="sw.ts" />
<br />
<p>
  Whenever you update a cached entry, you need to call the
  <ICD>updateTimestamp()</ICD>
  method so that its age is updated.
</p>
<br />
<CodeTab codes={data.code.advancedUsage.update} defaultTab="sw.ts" />
<br />
<p>
  Then, whenever you want to expire a set of entries, you can call the
  <ICD>expireEntries()</ICD> method which will enforce the
  <ICD>maxAgeSeconds</ICD> and <ICD>maxEntries</ICD> configuration.
</p>
<br />
<CodeTab codes={data.code.advancedUsage.expire} defaultTab="sw.ts" />
<br />
