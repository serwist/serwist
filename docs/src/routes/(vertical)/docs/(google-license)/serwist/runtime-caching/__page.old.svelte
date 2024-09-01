<script>
  import Callout from "$components/Callout.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import ETL from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="runtime-caching">Runtime caching</h1>
<ETL class="link" href="https://developer.chrome.com/docs/workbox/caching-resources-during-runtime">
  Original source (Apache 2.0 License). Adapted for Serwist's usage.
</ETL>
<h2 id="introduction">Introduction</h2>
<p>
  Some assets in your web application may be infrequently used, very large, or vary based on the user's device (such as responsive images) or
  language. These are instances where precaching may be an anti-pattern, and you should rely on runtime caching instead.
</p>
<h2 id="caching-strategies">Caching strategies</h2>
<p>Serwist provides these strategies out of the box:</p>
<ul class="list">
  <li>
    <a class="link" href="./runtime-caching/caching-strategies/stale-while-revalidate"><ICD>StaleWhileRevalidate</ICD></a> — Uses a cached response for
    a request if it's available and updates the cache in the background with a response from the network. Therefore, if the asset isn't cached, it will
    wait for the network response and use that. It's a fairly safe strategy, as it regularly updates cache entries that rely on it. The downside is that
    it always makes a network request in the background.
  </li>
  <li>
    <a class="link" href="./runtime-caching/caching-strategies/network-first"><ICD>NetworkFirst</ICD></a> — Tries to get a response from the network first.
    If a response is received, it passes that response to the browser and saves it to a cache. If the network request fails, the last cached response will
    be used, enabling offline access to the asset.
  </li>
  <li>
    <a class="link" href="./runtime-caching/caching-strategies/cache-first"><ICD>CacheFirst</ICD></a> — Checks the cache for a response first and uses
    it if available. If the request isn't in the cache, the network is used and any valid response is added to the cache before being passed to the browser.
  </li>
  <li>
    <a class="link" href="./runtime-caching/caching-strategies/network-only"><ICD>NetworkOnly</ICD></a> — Forces the response to come from the network.
  </li>
  <li>
    <a class="link" href="./runtime-caching/caching-strategies/cache-only"><ICD>CacheOnly</ICD></a> — Forces the response to come from the cache.
  </li>
</ul>
<p>
  You may also write your own strategy as detailed in
  <a class="link" href="./runtime-caching/caching-strategies#custom-strategy">Caching strategies: Creating a new strategy</a>.
</p>
<h2 id="route-matching">Applying caching strategies with route matching</h2>
<p>
  <a class="link" href="./core/serwist">The <ICD>Serwist</ICD> class</a> exposes the <ICD>registerCapture</ICD> method to allow you to match a pattern
  of routes to a caching strategy. <ICD>registerCapture</ICD> accepts two arguments:
</p>
<ul class="list">
  <li>A string, regular expression, or a match callback to specify route matching criteria.</li>
  <li>A handler for the route — typically a built-in <ICD>Strategy</ICD>.</li>
</ul>
<Callout type="info">
  You may also use the runtimeCaching option of Serwist's constructor. It is essentially a syntactic sugar for registerCapture.
</Callout>
<p>
  When the service worker intercepts a network request, Serwist tries to match the URL of the request to one of the registered handlers, which will
  then be used to generate a response. In the following example, we register a route that matches incoming same-origin image requests, applying the
  <ICD>CacheFirst</ICD> strategy.
</p>
<CodeTab codes={data.code.imageExample} defaultTab="sw.ts" />
<h2 id="using-multiple-caches">Using multiple caches</h2>
<p>
  Serwist allows you to bucket cached responses into separate <ICD>Cache</ICD> instances using the <ICD>cacheName</ICD> option available in the built-in
  strategies. In the following example, images use the <ICD>StaleWhileRevalidate</ICD> strategy, whereas CSS and JavaScript assets use the
  <ICD>CacheFirst</ICD> strategy. The route for each asset places responses into separate caches, by adding the <ICD>cacheName</ICD> property.
</p>
<CodeTab codes={data.code.multipleCaches} defaultTab="sw.ts" />
<enhanced:img
  src="$images/using-strategies-multiple-caches.png"
  sizes="min(902px, 100vw)"
  class="h-auto w-full"
  alt="Example using multiple caches"
/>
<h2 id="cors">Cross-origin considerations</h2>
<p>
  The interaction of your service worker with cross-origin assets is considerably different from with same-origin assets. Cross-Origin Resource
  Sharing (CORS) is complicated, and that complexity extends to how you handle cross-origin resources in a service worker.
</p>
<h3 id="opaque-responses">Opaque responses</h3>
<p>
  When making a cross-origin request in no-cors mode, the response can be stored in a service worker cache and even be used directly by the browser.
  However, the response body itself can't be read via JavaScript. This is known as an opaque response.
</p>
<p>
  Opaque responses are a security measure intended to prevent the inspection of a cross-origin asset. You can still make requests for cross-origin
  assets and even cache them, you just can't read the response body or even read its status code!
</p>
<h3 id="reminder-cors">Remember to opt into CORS mode</h3>
<p>
  Even if you load cross-origin assets that do set permissive CORS headers that allow you read responses, the body of cross-origin response may still
  be opaque. For example, the following HTML will trigger <ICD>no-cors</ICD> requests that will lead to opaque responses regardless of what CORS headers
  are set:
</p>
<CodeTab codes={data.code.cors.noCors} defaultTab="index.html" />
<p>
  To explicitly trigger a <ICD>cors</ICD> request that will yield a non-opaque response, you need to explicitly opt-in to CORS mode by adding the
  <ICD>crossorigin</ICD> attribute to your HTML:
</p>
<CodeTab codes={data.code.cors.cors} defaultTab="index.html" />
<p>This is important to remember when your service worker cache subresources loaded at runtime.</p>
<h3 id="serwist-cautious-opaque">Serwist may not cache opaque responses</h3>
<p>
  By default, Serwist takes a cautious approach to caching opaque responses. As it's impossible to examine the status code of opaque responses,
  caching an error response can result in a persistently broken experience if a cache-first or cache-only strategy is used.
</p>
<p>
  If you need to cache an opaque response in Serwist, you should use a network-first or stale-while-validate strategy to handle it. This ensures that
  failed responses won't persist, and will eventually be replaced by usable responses.
</p>
<p>
  If you use another caching strategy and an opaque response is returned, Serwist will warn you that the response wasn't cached when in development
  mode.
</p>
<Callout type="warning">
  If you are absolutely sure that you want Serwist to cache an opaque response using a cache-first or cache-only strategy, you can do so using
  <a class="link" href="./core/cacheable-response">CacheableResponse</a> or
  <a class="link" href="./runtime-caching/plugins/cacheable-response-plugin">CacheableResponsePlugin</a>.
</Callout>
<h3 id="opaque-size-padding">Opaque responses' size padding</h3>
<p>
  To avoid leakage of cross-domain information, there's a significant padding added to the size of an opaque response when calculating storage quota
  limits. This affects how <ETL class="link" href="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/storage">
    <ICD>navigator.storage</ICD>
  </ETL> reports storage quotas.
</p>
