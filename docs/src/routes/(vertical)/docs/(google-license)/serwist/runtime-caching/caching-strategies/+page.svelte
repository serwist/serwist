<script>
  import CodeTab from "$components/CodeTab.svelte";
  import ETL from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="caching-strategies">Caching strategies</h1>
<ETL class="link" href="https://developer.chrome.com/docs/workbox/modules/workbox-strategies">
  Original source (Apache 2.0 License). Adapted for Serwist's usage.
</ETL>
<h2 id="introduction">Introduction</h2>
<p>A caching strategy is a pattern that determines how a service worker generates a response after receiving a fetch event.</p>
<p>Serwist provides a number of strategies out of the box, and you can write your own strategies tailored to your use cases.</p>
<h2 id="built-in-strategies">Built-in strategies</h2>
<p>These strategies are built into Serwist:</p>
<ul class="list">
  <li>
    <a class="link" href="./caching-strategies/stale-while-revalidate"><ICD>StaleWhileRevalidate</ICD></a> — Uses a cached response for a request if it's
    available and updates the cache in the background with a response from the network. Therefore, if the asset isn't cached, it will wait for the network
    response and use that. It's a fairly safe strategy, as it regularly updates cache entries that rely on it. The downside is that it always makes a network
    request in the background.
  </li>
  <li>
    <a class="link" href="./caching-strategies/network-first"><ICD>NetworkFirst</ICD></a> — Tries to get a response from the network first. If a response
    is received, it passes that response to the browser and saves it to a cache. If the network request fails, the last cached response will be used, enabling
    offline access to the asset.
  </li>
  <li>
    <a class="link" href="./caching-strategies/cache-first"><ICD>CacheFirst</ICD></a> — Checks the cache for a response first and uses it if available.
    If the request isn't in the cache, the network is used and any valid response is added to the cache before being passed to the browser.
  </li>
  <li>
    <a class="link" href="./caching-strategies/network-only"><ICD>NetworkOnly</ICD></a> — Forces the response to come from the network.
  </li>
  <li>
    <a class="link" href="./caching-strategies/cache-only"><ICD>CacheOnly</ICD></a> — Forces the response to come from the cache.
  </li>
</ul>
<h2 id="using-plugins">Using plugins</h2>
<p>See <a class="link" href="/docs/serwist/runtime-caching/plugins">Using plugins</a>.</p>
<h2 id="custom-strategy">Creating a new strategy</h2>
<p>The following is an example of a strategy that reimplements the behavior of <ICD>NetworkOnly</ICD>:</p>
<CodeTab codes={data.code.customStrategy.networkOnly} defaultTab="sw.ts" />
<p>
  Notice how <ICD>handler.fetch()</ICD> is called instead of the native <ICD>fetch()</ICD> method. See
  <a class="link" href="./caching-strategies/strategy-handler">the reference documentation on <ICD>StrategyHandler</ICD></a> for more details.
</p>
<p>
  The following example is an example of a more complex strategy that uses multiple actions. It is based on
  <ETL class="link" href="https://jakearchibald.com/2014/offline-cookbook/#cache--network-race">cache-network-race from the Offline Cookbook</ETL>,
  but goes a step further and always updates the cache after a successful network request.
</p>
<CodeTab codes={data.code.customStrategy.cacheNetworkRace} defaultTab="sw.ts" />
<h2 id="strategy-custom-fetch">Using a strategy in your custom fetch logic</h2>
<p>If you do not want to use Serwist's built-in routing, you can also use the strategies in your own <ICD>fetch</ICD> event listener:</p>
<CodeTab codes={data.code.customFetch} defaultTab="sw.ts" />
