<script>
  import Callout from "$components/Callout.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import ETL from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="routing">Routing</h1>
<ETL class="link" href="https://developer.chrome.com/docs/workbox/modules/workbox-routing">
  Original source (Apache 2.0 License). Adapted for Serwist's usage.
</ETL>
<h2 id="introduction">Introduction</h2>
<p>
  A service worker can intercept network requests for a page. It may respond to the browser with cached content, content from the network or content
  generated in the service worker.
</p>
<p>Routing is how Serwist allows different functions to handle different requests.</p>
<p>When a network request is intercepted, Serwist attempts to respond to the request using the supplied routes and handlers.</p>
<enhanced:img src="$images/routing-diagram.png" sizes="min(1823px,100vw)" alt="Routing diagram" class="my-3" />
<p>The main things to note from the above are:</p>
<ul class="list">
  <li>
    The method of a request is important. By default, routes are registered for <ICD>GET</ICD> requests. If you wish to intercept other types of requests,
    you'll need to specify the method.
  </li>
  <li>
    The register order is important. If multiple registered routes can handle a request, the route that is registered first will be used to respond to
    the request.
  </li>
</ul>
<h2 id="route-matching">Applying caching strategies with route matching</h2>
<p>
  <a class="link" href="/docs/serwist/core/serwist">The <ICD>Serwist</ICD> class</a> exposes the <ICD>registerCapture</ICD> method to allow you to match
  a pattern of routes to a caching strategy. <ICD>registerCapture</ICD> accepts two arguments:
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
<h2 id="registering-navigation-route">Matching all navigation requests</h2>
<p>
  <ICD>NavigationRoute</ICD> allows you to match all navigation requests. If your site is a single page application, you can use
  <ICD>NavigationRoute</ICD> to return a specific response for all navigation requests:
</p>
<CodeTab codes={data.code.navigationRoute} defaultTab="sw.ts" />
<p>Alternatively, you can use <ICD>precacheOptions.navigateFallback</ICD>:</p>
<CodeTab codes={data.code.navigateFallback} defaultTab="sw.ts" />
<h2 id="setting-default-handler">Setting a default handler</h2>
<p>If you want to supply a handler for requests that don't match any route at all, you can set a default handler.</p>
<CodeTab codes={data.code.defaultHandler} defaultTab="sw.ts" />
<h2 id="setting-catch-handler">Setting a catch handler</h2>
<p>In the case of any of your routes throwing an error, you can capture and degrade gracefully by setting a catch handler.</p>
<CodeTab codes={data.code.catchHandler} defaultTab="sw.ts" />
<h2 id="route-matching-non-get">Defining a route for non-GET requests</h2>
<p>All routes by default are assumed to be for <ICD>GET</ICD> requests.</p>
<p>If you would like to route requests of other HTTP methods, you need to specify the method when registering the route like so:</p>
<CodeTab codes={data.code.nonGet} defaultTab="sw.ts" />
