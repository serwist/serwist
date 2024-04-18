<script>
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="serwist">Serwist</h1>
<h2 id="first-added">First added</h2>
<p>9.0.0</p>
<h2 id="about">About</h2>
<p>A class that helps bootstrap the service worker.</p>
<h2 id="parameters">Parameters</h2>
<ul class="list">
  <li>
    <ICD>precacheEntries</ICD> — A list of URLs that should be cached.
  </li>
  <li>
    <ICD>precacheOptions</ICD> — Options to customize how Serwist precaches the URLs in the precache list.
    <ul class="list">
      <li>
        <ICD>cacheName</ICD> — The cache used for precaching.
      </li>
      <li>
        <ICD>cleanupOutdatedCaches</ICD> — Whether outdated caches should be removed.
      </li>
      <li>
        <ICD>cleanURLs</ICD> — Tells Serwist to check the precache for an entry whose URL is the request URL appended with ".html".
      </li>
      <li>
        <ICD>concurrency</ICD> — The number of precache requests that should be made concurrently.
      </li>
      <li>
        <ICD>directoryIndex</ICD> — Tells Serwist to check the precache for an entry whose URL is the request URL appended with the specified value. Only
        applies if the request URL ends with "/".
      </li>
      <li>
        <ICD>fallbackToNetwork</ICD> — Whether to attempt to get the response from the network if there's a precache miss.
      </li>
      <li>
        <ICD>ignoreURLParametersMatching</ICD> — An array of <ICD>RegExp</ICD> objects matching search params that should be removed when looking for a
        precache match.
      </li>
      <li>
        <ICD>navigateFallback</ICD> — An URL that should point to a HTML file with which navigation requests for URLs that aren't precached will be fulfilled.
      </li>
      <li>
        <ICD>navigateFallbackAllowlist</ICD> — URLs that should be allowed to use the `navigateFallback` handler.
      </li>
      <li>
        <ICD>navigateFallbackDenylist</ICD> — URLs that should not be allowed to use the `navigateFallback` handler. This takes precedence over
        <ICD>navigateFallbackAllowlist</ICD>.
      </li>
      <li>
        <ICD>plugins</ICD> — Plugins to use when precaching as well as responding to fetch events for precached assets.
      </li>
      <li>
        <ICD>urlManipulation</ICD> — A function that should take a URL and return an array of alternative URLs that should be checked for precache matches.
      </li>
    </ul>
  </li>
  <li>
    <ICD>skipWaiting</ICD> — Forces the waiting service worker to become the active one.
  </li>
  <li>
    <ICD>importScripts</ICD> — Imports external scripts. They are executed in the order they are passed.
  </li>
  <li>
    <ICD>navigationPreload</ICD> — Enables navigation preloading if it is supported.
  </li>
  <li>
    <ICD>cacheId</ICD> — Modifies the prefix of the default cache names used by Serwist packages.
  </li>
  <li>
    <ICD>clientsClaim</ICD> — Claims any currently available clients once the service worker becomes active. This is normally used in conjunction with
    <ICD>skipWaiting()</ICD>.
  </li>
  <li>
    <ICD>runtimeCaching</ICD> — A list of caching strategies.
  </li>
  <li>
    <ICD>offlineAnalyticsConfig</ICD> — Your configuration for <ICD>initializeGoogleAnalytics</ICD>. This plugin is only initialized when this option
    is not <ICD>undefined</ICD> or <ICD>false</ICD>.
  </li>
  <li>
    <ICD>disableDevLogs</ICD> — Disables Serwist's logging in development mode.
  </li>
  <li>
    <ICD>fallbacks</ICD> — Precaches routes so that they can be used as a fallback when a <ICD>Strategy</ICD> fails to generate a response.
  </li>
</ul>
<h2 id="behind-the-constructor">Behind the constructor</h2>
<p>Behind the scenes, the constructor calls the following:</p>
<ul class="list">
  <li>
    <ICD>
      <ExternalLink class="link" href="https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts">
        self.importScripts
      </ExternalLink>
    </ICD> (if <ICD>importScripts</ICD> is not <ICD>undefined</ICD>)
  </li>
  <li>
    <ICD>serwist.enableNavigationPreload</ICD> (if <ICD>navigationPreload</ICD> is set to <ICD>true</ICD>)
  </li>
  <li>
    <ICD>serwist.setCacheNameDetails</ICD> (if <ICD>cacheId</ICD> is not <ICD>undefined</ICD>)
  </li>
  <li>
    <ICD>
      <ExternalLink class="link" href="https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting">
        self.skipWaiting
      </ExternalLink>
    </ICD> in the following situations:
    <ul class="list">
      <li>
        <ICD>skipWaiting</ICD> is set to <ICD>true</ICD>.
      </li>
      <li>
        Otherwise, when a message of type <ICD>"SKIP_WAITING"</ICD> is sent to the service worker.
      </li>
    </ul>
  </li>
  <li>
    <ICD>serwist.clientsClaim</ICD> (if <ICD>clientsClaim</ICD> is set to <ICD>true</ICD>)
  </li>
  <li>
    <ICD>
      <a class="link" href="/docs/serwist/plugins/precache-fallback-plugin">serwist.PrecacheFallbackPlugin</a>
    </ICD> (if <ICD>runtimeCaching</ICD> and <ICD>fallbacks</ICD> are not <ICD>undefined</ICD>)
  </li>
  <li>
    <ICD>serwist.initializeGoogleAnalytics</ICD> (if <ICD>offlineAnalyticsConfig</ICD> is set)
  </li>
  <li>
    <a class="link" href="/docs/serwist/core/disable-dev-logs"><ICD>serwist.disableDevLogs</ICD></a> (if <ICD>disableDevLogs</ICD> is set to
    <ICD>true</ICD>)
  </li>
</ul>
<h2 id="methods-and-fields">Methods and fields</h2>
<ul class="list">
  <li>
    <ICD>precacheStrategy</ICD> — The strategy used to precache assets and respond to fetch events.
  </li>
  <li>
    <ICD>routes</ICD> — A <ICD>Map</ICD> of HTTP methods (<ICD>'GET'</ICD>, etc.) to an array of all corresponding registered <ICD>Route</ICD> instances.
  </li>
  <li>
    <ICD>addEventListeners()</ICD> — Adds Serwist's event listeners for you. Before calling it, add your own listeners should you need to.
  </li>
  <li>
    <ICD>addToPrecacheList(entries)</ICD> — Adds items to the precache list, removing duplicates and ensuring the information is valid.
  </li>
  <li>
    <ICD>handleInstall(event)</ICD> — Precaches new and updated assets. Call this method from the service worker's <ICD>install</ICD> event.
  </li>
  <li>
    <ICD>handleActivate(event)</ICD> — Deletes assets that are no longer present in the current precache manifest. Call this method from the service worker's
    <ICD>activate</ICD> event.
  </li>
  <li>
    <ICD>handleFetch(event)</ICD> — Gets a <ICD>Response</ICD> from an appropriate <ICD>Route</ICD>'s handler. Call this method from the service
    worker's <ICD>fetch</ICD> event.
  </li>
  <li>
    <ICD>handleCache(event)</ICD> — Caches new URLs on demand. Call this method from the service worker's <ICD>message</ICD> event. To trigger the handler,
    send a message of type <ICD>"CACHE_URLS"</ICD> alongside a list of URLs that should be cached as <ICD>urlsToCache</ICD>.
  </li>
  <li>
    <ICD>setDefaultHandler(handler, method)</ICD> — Define a default <ICD>handler</ICD> that's called when no routes explicitly match the incoming request.
  </li>
  <li>
    <ICD>setCatchHandler(handler)</ICD> — If a <ICD>Route</ICD> throws an error while handling a request, this <ICD>handler</ICD> will be called and given
    a chance to provide a response.
  </li>
  <li>
    <ICD>registerCapture(capture, handler?, method?)</ICD> — Registers a <ICD>RegExp</ICD>, string, or function with a caching strategy to the router.
  </li>
  <li>
    <ICD>registerRoute(route)</ICD> — Registers a <ICD>Route</ICD> with the router.
  </li>
  <li>
    <ICD>unregisterRoute(route)</ICD> — Unregisters a <ICD>Route</ICD> with the router.
  </li>
  <li>
    <ICD>getUrlsToPrecacheKeys()</ICD> — Returns a mapping of a precached URL to the corresponding cache key, taking into account the revision information
    for the URL.
  </li>
  <li>
    <ICD>getPrecachedUrls()</ICD> — Returns a list of all the URLs that have been precached by the current service worker.
  </li>
  <li>
    <ICD>getPrecacheKeyForUrl(url)</ICD> — Returns the cache key used for storing a given URL. If that URL is unversioned, like "/index.html", then the
    cache key will be the original URL with a search parameter appended to it.
  </li>
  <li>
    <ICD>getIntegrityForPrecacheKey(cacheKey)</ICD> — Retrieves the subresource integrity associated with the cache key, or undefined if it's not set.
  </li>
  <li>
    <ICD>matchPrecache(request)</ICD> — This acts as a drop-in replacement for <ExternalLink
      href="https://developer.mozilla.org/en-US/docs/Web/API/Cache/match"
      class="link"
    >
      <ICD>cache.match()</ICD>
    </ExternalLink> with the following differences:
    <ul class="list">
      <li>It knows what the name of the precache is, and only checks in that cache.</li>
      <li>
        It allows you to pass in an "original" URL without versioning parameters, and it will automatically look up the correct cache key for the
        currently active revision of that URL.
      </li>
    </ul>
  </li>
  <li>
    <ICD>createHandlerBoundToUrl(url)</ICD> — Returns a function that looks up <ICD>url</ICD> in the precache (taking into account revision information),
    and returns the corresponding <ICD>Response</ICD>.
  </li>
  <li>
    <ICD>{"handleRequest({ request, event })"}</ICD> — Applies the routing rules to a <ICD>FetchEvent</ICD> object to get a <ICD>Response</ICD> from an
    appropriate <ICD>Route</ICD>'s handler.
  </li>
  <li>
    <ICD>{"findMatchingRoute({ url, sameOrigin, request, event })"}</ICD> — Checks a request and URL (and optionally an event) against the list of registered
    routes, and if there's a match, returns the corresponding route along with any params generated by the match.
  </li>
</ul>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.basicUsage} defaultTab="sw.ts" />
