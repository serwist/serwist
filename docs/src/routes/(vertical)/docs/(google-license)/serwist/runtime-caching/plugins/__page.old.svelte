<script>
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";
</script>

<h1 id="serwist-plugins">Using plugins</h1>
<ExternalLink class="link" href="https://developer.chrome.com/docs/workbox/using-plugins">
  Original source (Apache 2.0 License). Adapted for Serwist's usage.
</ExternalLink>
<h2 id="introduction">Introduction</h2>
<p>
  When using Serwist, you might want to manipulate a request or a response as they are processed. To support this, Serwist allows you to configure its
  lifecycle through plugins.
</p>
<p>Serwist provides a number of plugins out of the box, and you can write your own plugins tailored to your use cases.</p>
<h2 id="built-in-plugins">Built-in plugins</h2>
<p>Serwist provides these plugins out of the box:</p>
<ul class="list">
  <li>
    <a class="link" href="./plugins/background-sync-plugin"><ICD>BackgroundSyncPlugin</ICD></a> — Allows you to add failed network requests to a
    background sync queue so that they can be requested again when the next <ICD>sync</ICD> event is triggered.
  </li>
  <li>
    <a class="link" href="./plugins/broadcast-update-plugin"><ICD>BroadcastUpdatePlugin</ICD></a> — Allows you to dispatch a message on a Broadcast
    Channel or via <ICD>postMessage()</ICD> whenever a cache is updated.
  </li>
  <li>
    <a class="link" href="./plugins/cacheable-response-plugin"><ICD>CacheableResponsePlugin</ICD></a> — Determines if requests can be cached based on some
    specific criteria.
  </li>
  <li>
    <a class="link" href="./plugins/expiration-plugin"><ICD>ExpirationPlugin</ICD></a> — Manages the number and maximum age of items in a cache.
  </li>
  <li>
    <a class="link" href="./plugins/precache-fallback-plugin"><ICD>PrecacheFallbackPlugin</ICD></a> — Allows you to specify offline fallbacks to be used
    when a given strategy is unable to generate a response.
  </li>
</ul>
<h2 id="lifecycle-methods">Lifecycle methods</h2>
<p>
  A Serwist plugin needs to implement one or more lifecycle method(s). When you add a plugin to a <ICD>Strategy</ICD>, said plugin's callback
  functions are automatically run at the right time. The <ICD>Strategy</ICD> passes relevant information about the current request and/or response to those
  functions, giving your plugin the context it needs to take action. The following callback functions are supported:
</p>
<ul class="list">
  <li>
    <ICD>cacheWillUpdate</ICD> — Called before a <ICD>Response</ICD> object is added to a cache. In this method, you can modify said
    <ICD>Response</ICD>, or you can return <ICD>null</ICD> to avoid updating the cache entirely.
  </li>
  <li>
    <ICD>cacheDidUpdate</ICD> — Called when a new entry is added to a cache or an existing entry is updated. This method may be useful when you want to
    perform an action after a cache update.
  </li>
  <li>
    <ICD>cacheKeyWillBeUsed</ICD> — Called before a <ICD>Request</ICD> object is used as a cache key. This occurs for both cache lookups and cache writes.
    This method is handy if you need to override or normalize URLs prior to them being used to access caches.
  </li>
  <li>
    <ICD>cachedResponseWillBeUsed</ICD> — Called just before a cached response is used, allowing you to examine said response. You can either modify the
    <ICD>Response</ICD> object or return a nullish value.
  </li>
  <li>
    <ICD>requestWillFetch</ICD> — Called whenever a request is about to go to the network. Useful when you need to modify the request before it is fetched.
  </li>
  <li>
    <ICD>fetchDidFail</ICD> — Called when a network request throws an error, most likely due to an absence of network connectivity.
  </li>
  <li>
    <ICD>fetchDidSucceed</ICD> — Called whenever a network request succeeds, regardless of the HTTP response code.
  </li>
  <li>
    <ICD>handlerWillStart</ICD> — Called before any logic of the <ICD>Strategy</ICD>'s <ICD>handle()</ICD> method starts running. Useful when you need
    to set the initial handler state. For example, if you want to know how long the handler takes to generate a response, you can make a note of the start
    time in this callback.
  </li>
  <li>
    <ICD>handlerWillRespond</ICD> — Called before the <ICD>Strategy</ICD>'s <ICD>handle()</ICD> method returns a <ICD>Response</ICD>. Helpful when you
    need to modify said <ICD>Response</ICD>.
  </li>
  <li>
    <ICD>handlerDidRespond</ICD> — Called after the <ICD>Strategy</ICD>'s <ICD>handle()</ICD> method returns a <ICD>Response</ICD>, allowing you to
    record any final response detail.
  </li>
  <li>
    <ICD>handlerDidComplete</ICD> — Called after all <ExternalLink
      class="link"
      href="https://w3c.github.io/ServiceWorker/#extendableevent-extend-lifetime-promises"
    >
      extend lifetime promises
    </ExternalLink> of the event have settled. This is helpful if you need to record any data that needs to wait until the handler is done, such as cache
    hit status, cache latency, network latency, etc.
  </li>
  <li>
    <ICD>handlerDidError</ICD> — Called when the handler can't provide a valid response from any other source, which is the best time to provide a fallback
    response.
  </li>
</ul>
<p>
  The <ICD>event</ICD> object available in the methods listed above is the original event that triggered the fetch or cache action. Sometimes, there is
  not an original event, so your code should check if it exists before referencing it.
</p>
<p>
  All methods are also passed a <ICD>state</ICD> object, which is unique to a particular plugin and the strategy it invokes. This means you can write plugins
  where one callback can conditionally perform a task based on what another callback in the same plugin did.
</p>
