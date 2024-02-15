<script>
  import Callout from "$components/Callout.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="welcome">
  Welcome to <InlineCode>@serwist/background-sync</InlineCode>!
</h1>
<br /><br />
<h2 id="introduction">Introduction</h2>
<br />
<p>
  <InlineCode>@serwist/background-sync</InlineCode> is a module that queues failed
  requests and uses the
  <a
    class="link"
    href="https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API"
    target="_blank"
    rel="noreferrer"
  >
    Background Synchronization API
  </a> to replay them when the network is available.
</p>
<br />
<p>
  When you send data to a web server, sometimes the requests will fail. It may
  be because the user has lost connectivity, or it may be because the server is
  down; in either case you often want to try sending the requests again later.
</p>
<br />
<p>
  The Background Synchronization API is an ideal solution to this problem. When
  a service worker detects that a network request has failed, it can register to
  receive a sync event, which gets delivered when the browser thinks
  connectivity has returned. Note that the sync event can be delivered even if
  the user has left the application, making it much more effective than the
  traditional method of retrying failed requests.
</p>
<br />
<p>
  <InlineCode>@serwist/background-sync</InlineCode> is designed to make it easier
  to use the Background Synchronization API with Serwist. It also implements a fallback
  strategy for browsers that haven't implemented this API yet. Browsers that have
  will automatically replay failed requests on your behalf at an interval managed
  by the browser, likely using exponential backoff between replay attempts. In browsers
  that don't natively support the API, this module will automatically attempt a replay
  whenever your service worker starts up.
</p>
<br /><br />
<h2 id="basic-usage">Basic usage</h2>
<br />
<p>
  The easiest way to use this module is to use the plugin, which automatically
  queues up failed requests and retry them when future
  <a
    href="https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/sync_event"
  >
    <InlineCode>sync</InlineCode>
  </a> events are fired.
</p>
<br />
<CodeTab codes={data.code.basicUsage.setup} defaultTab="sw.ts" />
<br />
<p>
  This plugin hooks into the <InlineCode>fetchDidFail</InlineCode> callback, which
  is only invoked if there's an exception thrown, most likely due to a network failure.
  This means that requests won't be retried if there's a response received with a
  4xx or 5xx error status. If you would like to retry all requests that result in,
  e.g., a 5xx status, you can do so by hooking into the
  <InlineCode>fetchDidSucceed</InlineCode> callback:
</p>
<br />
<CodeTab codes={data.code.basicUsage.errorResponse} defaultTab="sw.ts" />
<br /><br />
<h2 id="advanced-usage">Advanced usage</h2>
<br />
<p>
  This module also provides <InlineCode>Queue</InlineCode>, which is a class you
  can instantiate and add failed requests to. The failed requests are stored in
  IndexedDB and retried when the browser thinks connectivity is restored (i.e.
  when it receives the <InlineCode>sync</InlineCode> event).
</p>
<br />
<h3 id="creating-a-queue">
  Creating a <InlineCode>Queue</InlineCode>
</h3>
<br />
<p>
  To create a <InlineCode>Queue</InlineCode> you need to construct it with a queue
  name (which must be unique to your
  <a
    class="link"
    href="https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#definition_of_an_origin"
    target="_blank"
    rel="noreferrer"
  >
    origin
  </a>):
</p>
<br />
<CodeTab codes={data.code.advancedUsage.setup} defaultTab="sw.ts" />
<br />
<p>
  The queue name is used as a part of the tag name that gets registered by the
  global
  <InlineCode>
    <a
      class="link"
      href="https://developer.mozilla.org/en-US/docs/Web/API/SyncManager"
      target="_blank"
      rel="noreferrer"
    >
      SyncManager
    </a>
  </InlineCode>. It's also used as the Object Store name for the IndexedDB
  database.
</p>
<br />
<Callout type="info">
  Note: It's not important that you know the details above, but they're the
  reason the queue name has to be unique to your origin.
</Callout>
<br />
<h3 id="adding-a-request-to-the-queue">
  Adding a request to the <InlineCode>Queue</InlineCode>
</h3>
<br />
<p>
  Once you've created your <InlineCode>Queue</InlineCode> instance, you can add failed
  requests to it by invoking the <InlineCode>.pushRequest()</InlineCode> method.
  For example, the following code catches any requests that fail and adds them to
  the queue:
</p>
<br />
<CodeTab codes={data.code.advancedUsage.addingRequest} defaultTab="sw.ts" />
<br />
<p>
  Once added to the queue, the request is automatically retried when the service
  worker receives the <InlineCode>sync</InlineCode> event (which happens when the
  browser thinks connectivity is restored). Browsers that don't support the Background
  Synchronization API will retry the queue every time the service worker is started
  up. This requires the page controlling the service worker to be running, so it
  won't be quite as effective.
</p>
<br /><br />
<h2 id="testing">Testing</h2>
<br />
<p>
  Sadly, testing background synchronization is somewhat unintuitive and
  difficult for a number of reasons.
</p>
<br />
<p>The best approach to test your implementation is to do the following:</p>
<br />
<ul class="list !list-decimal">
  <li>Load up a page and register your service worker.</li>
  <li>
    Turn off your computer's network or turn off your web server. DO NOT USE
    CHROME DEVTOOLS OFFLINE. The offline checkbox in DevTools only affects
    requests from the page. Service Worker requests will continue to go through.
  </li>
  <li>
    Make network requests that should be queued by
    <InlineCode>@serwist/background-sync</InlineCode>. You can check whether the
    requests have been queued by looking in {"Chrome DevTools > Application > IndexedDB > serwist-background-sync > requests"}
  </li>
  <li>Now turn on your network or web server.</li>
  <li>
    Force an early sync event by going to {"Chrome DevTools > Application > Service Workers"},
    entering the tag name of serwist-background-sync:$YOUR_QUEUE_NAME where
    $YOUR_QUEUE_NAME should be the name of the queue you set, and then clicking
    the 'Sync' button.
    <enhanced:img
      src="$images/bg-sync-example-sync-button.png"
      sizes="min(804px, 100vw)"
      class="w-full h-auto"
      alt="Example 'Sync' button"
    />
  </li>
  <li>
    You should see network requests go through for the failed requests and the
    IndexedDB data should now be empty since the requests have been successfully
    replayed.
  </li>
</ul>
