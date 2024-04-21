<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ETL from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="strategy-handler">StrategyHandler</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>
  A class created every time a <a class="link" href="./strategy"><ICD>Strategy</ICD></a> instance calls <ICD>Strategy.handle</ICD> or
  <ICD>Strategy.handleAll</ICD> that wraps all fetch and cache actions around plugin callbacks and keeps track of when the strategy is "done" (i.e. when
  all added <ICD>event.waitUntil()</ICD> promises have resolved).
</p>
<h2 id="methods-and-fields">Methods and fields</h2>
<ul class="list">
  <li><ICD>event</ICD> — The event associated with this request.</li>
  <li>
    <ICD>request</ICD> — The request the strategy is processing (passed to the strategy's <ICD>handle()</ICD> or
    <ICD>handleAll()</ICD> method).
  </li>
  <li>
    <ICD>url</ICD> — A <ICD>URL</ICD> instance of <ICD>request.url</ICD> (if passed to the strategy's <ICD>handle()</ICD> or
    <ICD>handleAll()</ICD> method). Note: the <ICD>url</ICD> param will be present if the strategy is invoked from a <ICD>Route</ICD> object.
  </li>
  <li>
    <ICD>params</ICD> — Some additional params (if passed to the strategy's <ICD>handle()</ICD> or
    <ICD>handleAll()</ICD> method). Note: the <ICD>params</ICD> param will be present if the strategy is invoked from a <ICD>Route</ICD> object and that
    route's matcher returned a truthy value (it will be that value).
  </li>
  <li>
    <ICD>async fetch(requestInfo)</ICD> — Fetches a given request (and invokes any applicable plugin callback methods), taking the
    <ICD>fetchOptions</ICD> (for non-navigation requests) and <ICD>plugins</ICD> provided to the <ICD>Strategy</ICD> object into account.
  </li>
  <li>
    <ICD>async fetchAndCachePut(requestInfo)</ICD> — Calls <ICD>this.fetch()</ICD> and (in the background) caches the generated response. The call to
    <ICD>this.cachePut()</ICD> automatically invokes <ICD>this.waitUntil()</ICD>, so you do not have to call <ICD>waitUntil()</ICD> yourself.
  </li>
  <li>
    <ICD>async cacheMatch(key)</ICD> — Matches a request from the cache (and invokes any applicable plugin callback method) using the
    <ICD>cacheName</ICD>, <ICD>matchOptions</ICD>, and <ICD>plugins</ICD> provided to the <ICD>Strategy</ICD> object. The following lifecycle methods are
    invoked when using this method:
    <ul class="list">
      <li><ICD>cacheKeyWillByUsed</ICD></li>
      <li><ICD>cachedResponseWillByUsed</ICD></li>
    </ul>
  </li>
  <li>
    <ICD>async cachePut(key, response)</ICD> — Puts a request/response pair into the cache (and invokes any applicable plugin callback method) using the
    <ICD>cacheName</ICD> and <ICD>plugins</ICD> provided to the <ICD>Strategy</ICD> object. The following plugin lifecycle methods are invoked when using
    this method:
    <ul class="list">
      <li><ICD>cacheKeyWillByUsed</ICD></li>
      <li><ICD>cacheWillUpdate</ICD></li>
      <li><ICD>cacheDidUpdate</ICD></li>
    </ul>
  </li>
  <li>
    <ICD>async getCacheKey(request, mode)</ICD> — Checks the <ICD>plugins</ICD> provided to the <ICD>Strategy</ICD> object for
    <ICD>cacheKeyWillBeUsed</ICD> callbacks and executes found callbacks in sequence. The final <ICD>Request</ICD> object returned by the last plugin is
    treated as the cache key for cache reads and/or writes. If no <ICD>cacheKeyWillBeUsed</ICD> plugin callbacks have been registered, the passed request
    is returned unmodified.
  </li>
  <li>
    <ICD>hasCallback(name)</ICD> — Returns <ICD>true</ICD> if the strategy has at least one plugin with the given callback.
  </li>
  <li>
    <ICD>async runCallbacks(name, param)</ICD> — Runs all plugin callbacks matching the given name, in order, passing the given <ICD>param</ICD> object
    (merged with the plugin's current state) as the only argument.
  </li>
  <li>
    <ICD>*iterateCallbacks(name)</ICD> — Accepts a callback name and returns an iterable of matching plugin callbacks.
  </li>
  <li>
    <ICD>waitUntil(promise)</ICD> — Adds a promise to the
    <ETL class="link" href="https://w3c.github.io/ServiceWorker/#extendableevent-extend-lifetime-promises">extend lifetime promises</ETL>
    of the event event associated with the request being handled (usually a <ICD>FetchEvent</ICD>).
  </li>
  <li>
    <ICD>async doneWaiting()</ICD> — Returns a promise that resolves once all promises passed to <ICD>this.waitUntil()</ICD> have settled. Note: any work
    done after <ICD>doneWaiting()</ICD> settles should be manually passed to an event's <ICD>waitUntil()</ICD> method (not <ICD>this.waitUntil()</ICD
    >), otherwise the service worker thread may be killed prior to your work completing.
  </li>
  <li>
    <ICD>destroy()</ICD> — Stops running the strategy and immediately resolves any pending <ICD>waitUntil()</ICD> promise.
  </li>
</ul>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
<h2 id="more-resources">More resources</h2>
<p>Here is a list of resources you can read to learn more about <ICD>StrategyHandler</ICD>:</p>
<ul class="list">
  <li>
    <a class="link" href="/docs/serwist/runtime-caching">Runtime caching</a>
  </li>
  <li>
    <a class="link" href="/docs/serwist/runtime-caching/plugins">Using plugins</a>
  </li>
  <li>
    <a class="link" href="./strategy"><ICD>Strategy</ICD>'s reference documentation</a>
  </li>
</ul>
