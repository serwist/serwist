<script>
  import Callout from "$components/Callout.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="background-syncing">Background synchronizing</h1>
<ExternalLink class="link" href="https://developer.chrome.com/docs/workbox/modules/workbox-background-sync">
  Original source (Apache 2.0 License). Adapted for Serwist's usage.
</ExternalLink>
<h2 id="introduction">Introduction</h2>
<p>
  When you send data to a web server, sometimes the requests will fail. It may be because the user has lost connectivity, or it may be because the
  server is down; in either case you often want to try sending the requests again later.
</p>
<p>
  The <ExternalLink class="link" href="https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API">
    Background Synchronization API
  </ExternalLink>
  is an ideal solution to this problem. When a service worker detects that a network request has failed, it can register to receive a <ICD>sync</ICD> event,
  which gets delivered when the browser thinks connectivity has returned. Note that the <ICD>sync</ICD> event can be delivered even if the user has left
  the application, making it much more effective than the traditional method of retrying failed requests.
</p>
<p>
  Serwist provides plugins designed to make using the Background Synchronization API with it easier. It also implements a fallback strategy for
  browsers that haven't implemented this API yet. Browsers that have will automatically replay failed requests on your behalf at an interval managed
  by the browser, likely using exponential backoff between replay attempts. In browsers that don't natively support the API, this module will
  automatically attempt a replay whenever your service worker starts up.
</p>
<h2 id="basic-usage">Basic usage</h2>
<p>
  The easiest way to set up is to use the plugin, which automatically queues up failed requests and retry them when future
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/sync_event">
    <ICD>sync</ICD>
  </a> events are fired.
</p>
<CodeTab codes={data.code.basicUsage.setup} defaultTab="sw.ts" />
<p>
  This plugin hooks into the <ICD>fetchDidFail</ICD> callback, which is only invoked if there's an exception thrown, most likely due to a network failure.
  This means that requests won't be retried if there's a response received with a 4xx or 5xx error status. If you would like to retry all requests that
  result in, e.g., a 5xx status, you can do so by hooking into the
  <ICD>fetchDidSucceed</ICD> callback:
</p>
<CodeTab codes={data.code.basicUsage.errorResponse} defaultTab="sw.ts" />
<h2 id="advanced-usage">Advanced usage</h2>
<p>
  Serwist also provides <ICD>BackgroundSyncQueue</ICD>, which is a class you can instantiate and add failed requests to. The failed requests are
  stored in IndexedDB and retried when the browser thinks connectivity is restored (i.e. when it receives the <ICD>sync</ICD> event).
</p>
<h3 id="creating-a-queue">
  Creating a <ICD>BackgroundSyncQueue</ICD>
</h3>
<p>
  To create a <ICD>BackgroundSyncQueue</ICD> you need to construct it with a queue name (which must be unique to your
  <a
    class="link"
    href="https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#definition_of_an_origin"
    target="_blank"
    rel="noreferrer"
  >
    origin
  </a>):
</p>
<CodeTab codes={data.code.advancedUsage.setup} defaultTab="sw.ts" />
<p>
  The queue name is used as a part of the tag name that gets registered by the global
  <ICD>
    <a class="link" href="https://developer.mozilla.org/en-US/docs/Web/API/SyncManager" target="_blank" rel="noreferrer"> SyncManager </a>
  </ICD>. It's also used as the Object Store name for the IndexedDB database.
</p>
<Callout type="info">
  Note: It's not important that you know the details above, but they're the reason the queue name has to be unique to your origin.
</Callout>
<h3 id="adding-a-request-to-the-queue">Adding a request to the BackgroundSyncQueue</h3>
<p>
  Once you've created your <ICD>BackgroundSyncQueue</ICD> instance, you can add failed requests to it by invoking the
  <ICD>.pushRequest()</ICD> method. For example, the following code catches any requests that fail and adds them to the queue:
</p>
<CodeTab codes={data.code.advancedUsage.addingRequest} defaultTab="sw.ts" />
<p>
  Once added to the queue, the request is automatically retried when the service worker receives the <ICD>sync</ICD> event (which happens when the browser
  thinks connectivity is restored). Browsers that don't support the Background Synchronization API will retry the queue every time the service worker is
  started up. This requires the page controlling the service worker to be running, so it won't be quite as effective.
</p>
<h2 id="testing">Testing</h2>
<p>Sadly, testing background synchronization is somewhat unintuitive and difficult for a number of reasons.</p>
<p>The best approach to test your implementation is to do the following:</p>
<ul class="list !list-decimal">
  <li>Load up a page and register your service worker.</li>
  <li>
    Turn off your computer's network or turn off your web server. DO NOT USE CHROME DEVTOOLS OFFLINE. The offline checkbox in DevTools only affects
    requests from the page. Service Worker requests will continue to go through.
  </li>
  <li>
    Make network requests that should be queued. You can check whether the requests have been queued by looking in {"Chrome DevTools > Application > IndexedDB > serwist-background-sync > requests"}
  </li>
  <li>Now turn on your network or web server.</li>
  <li>
    Force an early sync event by going to {"Chrome DevTools > Application > Service Workers"}, entering the tag name of
    serwist-background-sync:$YOUR_QUEUE_NAME where $YOUR_QUEUE_NAME should be the name of the queue you set, and then clicking the 'Sync' button.
    <enhanced:img src="$images/bg-sync-example-sync-button.png" sizes="min(804px, 100vw)" class="h-auto w-full" alt="Example 'Sync' button" />
  </li>
  <li>
    You should see network requests go through for the failed requests and the IndexedDB data should now be empty since the requests have been
    successfully replayed.
  </li>
</ul>
