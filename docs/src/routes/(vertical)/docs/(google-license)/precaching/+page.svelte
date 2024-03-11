<script>
  import Callout from "$components/Callout.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="serwist-precaching">@serwist/precaching</h1>
<br />
<a href="https://developer.chrome.com/docs/workbox/modules/workbox-precaching" class="link" target="_blank" rel="noreferrer">
  Original source (Apache 2.0 License). Adapted for Serwist's usage.
</a>
<br /><br />
<h2 id="introduction">Introduction</h2>
<br />
<p>
  <ICD>@serwist/precaching</ICD> is a module that efficiently precaches assets.
</p>
<br />
<p>
  One feature of service workers is the ability to save a set of files to the cache when the service worker is installing. This is often referred to
  as "precaching", since you are caching content ahead of the service worker being used.
</p>
<br />
<p>
  The main reason for doing this is that it gives developers control over the cache, meaning they can determine when and how long a file is cached as
  well as serve it to the browser without going to the network, meaning it can be used to create web apps that work offline.
</p>
<br />
<p>Serwist takes a lot of the heavy lifting out of precaching by simplifying the API and ensuring assets are downloaded efficiently.</p>
<br /><br />
<h2 id="how-serwist-precaching-works">How @serwist/precaching works</h2>
<br />
<p>
  When a web app is loaded for the first time, <ICD>@serwist/precaching</ICD> will look at all the assets you want to download, remove any duplicates and
  hook up the relevant service worker events to download and store the assets. URLs that already include versioning information (like a content hash) are
  used as cache keys without any further modification. URLs that don't include versioning information have an extra URL query parameter appended to their
  cache key representing a hash of their content that Workbox generates at build time.
</p>
<br />
<p><ICD>@serwist/precaching</ICD> does all of this during the service worker's <ICD>install</ICD> event.</p>
<br />
<p>
  When a user later revisits your web app and you have a new service worker with different precached assets, <ICD>@serwist/precaching</ICD> will look at
  the new list and determine which assets are completely new and which of the existing assets need updating, based on their revisioning. Any new assets,
  or updating revisions, will be added to the cache during the new service worker's <ICD>install</ICD> event.
</p>
<br />
<p>
  This new service worker won't be used to respond to requests until its <ICD>activate</ICD> event has been triggered. It's in the <ICD>activate</ICD>
  event that <ICD>@serwist/precaching</ICD> will check for any cached assets that are no longer present in the list of current URLs, and remove those from
  the cache.
</p>
<br />
<p>
  <ICD>@serwist/precaching</ICD> will perform these steps each time your service worker is installed and activated, ensuring the user has the latest assets,
  and only downloading the files that have changed.
</p>
<br />
<h3 id="serving-precached-responses">Serving precached responses</h3>
<br />
<p>Calling <ICD>precacheAndRoute()</ICD> or <ICD>addRoute()</ICD> will create a route that matches requests for precached URLs.</p>
<br />
<p>
  The response strategy used in this route is cache-first: the precached response will be used, unless that cached response is not present (due to
  some unexpected error), in which case a network response will be used instead.
</p>
<br />
<p>
  The order in which you register routes is important. You normally want to call <ICD>precacheAndRoute()</ICD> or <ICD>addRoute()</ICD> prior to registering
  any additional routes with <ICD><a class="link" href="/docs/routing/register-route">registerRoute()</a></ICD>. If you call
  <ICD>registerRoute()</ICD> first, and that route matches an incoming request, whatever strategy you defined in that additional route will be used to
  respond, instead of the cache-first strategy used by <ICD>@serwist/precaching</ICD>.
</p>
<br /><br />
<h2 id="explanation-of-the-precache-list">Explanation of the precache list</h2>
<br />
<p>
  <ICD>@serwist/precaching</ICD> expects an array of objects with a url and revision property. This array is sometimes referred to as a precache manifest:
</p>
<br />
<CodeTab codes={data.code.explainPrecacheList} defaultTab="sw.ts" />
<br />
<p>This list references a set of URLs, each with their own piece of "revisioning" information.</p>
<br />
<p>
  For the second and third object in the example above, the revision property is set to null. This is because the revisioning information is in the
  URL itself, which is generally a best practice for static assets.
</p>
<br />
<p>
  The first object explicitly set a revision property, which is an auto-generated hash of the file's contents. Unlike JavaScript and CSS resources,
  HTML files generally cannot include revisioning information in their URLs. Otherwise, links to these files on the web would break any time the
  content of the page changed.
</p>
<br />
<p>By passing a revision property to <ICD>precacheAndRoute()</ICD>, Serwist can know when the file has changed and update it accordingly.</p>
<br />
<p>Serwist provides build tools that help generate this list:</p>
<br />
<ul class="list">
  <li>
    <ICD><a class="link" href="/docs/build">@serwist/build</a></ICD>: A module that integrates into your build process, helping you generate a
    manifest of local files that should be precached.
  </li>
  <li>
    <ICD><a class="link" href="/docs/webpack-plugin">@serwist/webpack-plugin</a></ICD>: A plugin for your Webpack build process, helping you generate
    a manifest of local files that should be precached..
  </li>
  <li>
    <ICD><a class="link" href="/docs/cli">@serwist/cli</a></ICD>: The command line interface of Serwist.
  </li>
  <li>
    <ICD><a class="link" href="/docs/vite">@serwist/vite</a></ICD>: A module that integrates Serwist into your Vite application.
  </li>
  <li>
    <ICD><a class="link" href="/docs/next">@serwist/next</a></ICD>: A module that integrates Serwist into your Next.js application.
  </li>
  <li>
    <ICD><a class="link" href="/docs/svelte">@serwist/svelte</a></ICD>: A module that complements SvelteKit's built-in service worker support.
  </li>
</ul>
<br />
<Callout type="warning">
  It's strongly recommended that you use one of the mentioned tools to generate this manifest rather than hardcoding it yourself.
</Callout>
<br /><br />
<h2 id="incoming-requests-for-precached-files">Incoming requests for precached files</h2>
<br />
<p>
  One thing that <ICD>@serwist/precaching</ICD> does out of the box is manipulating incoming network requests to try and match precached files. This accommodates
  for common practices on the web.
</p>
<br />
<p>For example, a request for "/" can usually be satisfied by the file at "/index.html".</p>
<br />
<p>Below are the list of manipulations that <ICD>@serwist/precaching</ICD> performs by default and a guide on customizing the behaviour.</p>
<br />
<h3 id="ignoring-url-parameters">Ignoring URL parameters</h3>
<br />
<p>Requests with search parameters can be altered to remove specific values or all values.</p>
<br />
<p>
  By default, search parameters that start with <ICD>utm_</ICD> or exactly match <ICD>fbclid</ICD> are removed, meaning that a request for "/about.html?utm_campaign=abcd"
  will be fulfilled with a precached entry for "/about.html".
</p>
<br />
<p>You can ignore a different set of search parameters using <ICD>ignoreURLParametersMatching</ICD>:</p>
<br />
<CodeTab codes={data.code.ignoringUrlsParameter} defaultTab="sw.ts" />
<br />
<h3 id="handling-directory-index">Handling directory index</h3>
<br />
<p>
  Requests ending in a "/" will, by default, be matched against entries with an "index.html" appended to the end. This means an incoming request for
  "/" can automatically be handled with the precached entry "/index.html".
</p>
<br />
<p>You can change this to something else, or disable it completely, by setting <ICD>directoryIndex</ICD>:</p>
<br />
<CodeTab codes={data.code.handlingDirectoryIndex} defaultTab="sw.ts" />
<br />
<h3 id="supporting-clean-urls">Supporting clean URLs</h3>
<br />
<p>
  If a request fails to match the precache, we'll add .html to the end to support "clean" URLs (a.k.a. "pretty" URLs). This means a request like
  /about will be handled by the precached entry for /about.html.
</p>
<br />
<p>You can disable this behavior by setting <ICD>cleanURLs</ICD>:</p>
<br />
<CodeTab codes={data.code.supportingCleanUrls} defaultTab="sw.ts" />
<br />
<h3 id="manipulating-urls">Manipulating URLs</h3>
<br />
<p>
  If you want to define custom matches from incoming requests to precached assets, you can do so with the <ICD>urlManipulation</ICD> option. This should
  be a callback that returns an array of possible matches.
</p>
<br />
<CodeTab codes={data.code.manipulatingUrls} defaultTab="sw.ts" />
<br /><br />
<h2 id="advanced-usage">Advanced usage</h2>
<br />
<h3 id="using-precache-controller">Using PrecacheController</h3>
<br />
<p>
  By default, <ICD>@serwist/precaching</ICD> will set up the <ICD>install</ICD> and <ICD>activate</ICD> listeners for you. For developers familiar with
  service workers, this may not be desirable if you need more control, in which case, you can directly use <ICD>PrecacheController</ICD> and determine
  when assets are precached and when cleanup should occur on your own.
</p>
<br />
<CodeTab codes={data.code.advancedUsage.precacheController} defaultTab="sw.ts" />
<br />
<h3 id="reading-precached-assets">Reading precached assets</h3>
<br />
<p>
  There are times when you might need to read a precached asset directly, outside the context of the routing that workbox-precaching can automatically
  perform. For instance, you might want to precache partial HTML templates that then need to be retrieved and used when constructing a full response.
</p>
<br />
<p>
  In general, you can use the Cache Storage API to obtain the precached Response objects, but there is one wrinkle: the URL cache key that needs to be
  used when calling <ICD>cache.match()</ICD> might contain a versioning parameter that <ICD>@serwist/precaching</ICD> automatically creates and maintains.
</p>
<br />
<p>
  To get the correct cache key you can call <ICD>getCacheKeyForURL()</ICD> and then use the result to perform a <ICD>cache.match()</ICD> on the appropriate
  cache.
</p>
<br />
<CodeTab codes={data.code.advancedUsage.readingPrecachedAssets.getCacheKeyForUrl} defaultTab="sw.ts" />
<br />
<p>
  Alternatively, if all you need is the precached <ICD>Response</ICD> object, you can call <ICD>matchPrecache()</ICD>, which will automatically use
  the correct cache key and search in the correct cache:
</p>
<br />
<Callout type="info">
  If you are using your own PrecacheController instance, instead of using the default instance via precacheAndRoute, you should call the
  matchPrecache() or getCacheKeyForURL() methods directly on that instance.
</Callout>
<br />
<h3 id="cleaning-up-old-precaches">Cleaning up old precaches</h3>
<br />
<p>
  Obsolete data shouldn't interfere with normal operations, but it does contribute towards your overall storage quota usage, and it can be friendlier
  to your users to explicitly delete it. You can do this by adding <ICD>cleanupOutdatedCaches()</ICD> to your service worker.
</p>
<br />
<h3 id="using-subresource-integrity">Using subresource integrity</h3>
<br />
<p>Some developers might want the added guarantees offered by subresource integrity enforcement when retrieving precached URLs from the network.</p>
<br />
<p>
  An additional, optional property called <ICD>integrity</ICD> can be added to any entry in the precache manifest. If provided, it will be used as the
  <ICD>integrity</ICD> value when constructing the <ICD>Request</ICD> used to populate the cache. If there's a mismatch, the precaching process will fail.
</p>
<br />
<p>
  Determining which precache manifest entries should have integrity properties and figuring out the appropriate values to use is outside the scope of
  Serwist's build tools. Instead, developers who want to opt-in to this functionality should modify the precache manifest that SerwistWorkbox
  generates to add in the appropriate info themselves. The <ICD>manifestTransform</ICD> option in Serwist's build tools configuration can help:
</p>
<br />
<CodeTab codes={data.code.advancedUsage.usingSsri} defaultTab="sw.ts" />