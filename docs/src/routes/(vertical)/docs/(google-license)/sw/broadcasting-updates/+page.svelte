<script>
  import Callout from "$components/Callout.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="broadcasting-updates">Broadcasting cache updates</h1>
<a class="link" href="https://developer.chrome.com/docs/workbox/modules/workbox-broadcast-update" target="_blank" rel="noreferrer">
  Original source (Apache 2.0 License). Adapted for Serwist's usage.
</a>
<h2 id="introduction">Introduction</h2>
<p>When responding to requests with cached entries, while being fast, it comes with a tradeoff that users may end up seeing stale data.</p>
<p>
  Serwist can notify Window Clients whenever a cached response is updated using the <a
    class="link"
    href="https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API"
    target="_blank"
    rel="noreferrer"
  >
    Broadcast Channel API
  </a>. This functionality is most commonly used along with the
  <a class="link" href="/docs/sw/runtime-caching/stale-while-revalidate"><ICD>StaleWhileRevalidate</ICD></a> strategy.
</p>
<p>
  Whenever the "revalidate" step of that strategy retrieves a response from the network that differs from what was previously cached, this module will
  send a message (via <ICD>postMessage()</ICD>) to all clients within scope of the current service worker.
</p>
<p>
  Clients can listen for updates and take appropriate action, like automatically displaying a message to the user letting them know that updates are
  available.
</p>
<h2 id="how-are-updates-determined">How are updates determined?</h2>
<p>
  Certain headers of the cached and new Response objects are compared, and if any of the headers have different values, it's considered an update.
</p>
<p>By default, the <ICD>Content-Length</ICD>, <ICD>ETag</ICD>, and <ICD>Last-Modified</ICD> headers are compared.</p>
<p>
  Serwist uses header values instead of a byte-for-byte comparison of response bodies to be more efficient, in particular for potentially large
  responses.
</p>
<Callout type="warning">
  Because Serwist needs to be able to read the header values, <a
    class="link"
    href="https://stackoverflow.com/questions/39109789/what-limitations-apply-to-opaque-responses"
    target="_blank"
    rel="noreferrer"
  >
    opaque responses
  </a>, whose headers are not accessible, will never trigger update messages.
</Callout>
<h2 id="message-format">Message format</h2>
<p>
  When a message event listener is invoked in your web app, the
  <ICD>event.data</ICD> property will have the following format:
</p>
<CodeTab codes={data.code.messageFormat} defaultTab="event.data" />
<p>
  This is represented as the <ICD>BroadcastMessage</ICD> type, which you can import from this module.
</p>
<h2 id="basic-usage">Basic usage</h2>
<p>
  The module is intended to be used along with the <ICD>StaleWhileRevalidate</ICD> strategy, since that strategy involves returning a cached response immediately
  but also provides a mechanism for updating the cache asynchronously.
</p>
<Callout type="info">
  Note: BroadcastUpdatePlugin can't be used to broadcast information about @serwist/routing's updates. It only detects when a previously cached URL
  has been overwritten with new contents, but @serwist/precaching creates cache entries with URLs that uniquely correspond to the contents, so it will
  never overwrite existing cache entries.
</Callout>
<p>
  To broadcast updates, you just need to add a
  <ICD>BroadcastUpdatePlugin</ICD> instance to your strategy's
  <ICD>plugins</ICD>.
</p>
<CodeTab codes={data.code.basicUsage.setup} defaultTab="sw.ts" />
<p>
  In your web app, before the
  <ICD>
    <a class="link" href="https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event" target="_blank" rel="noreferrer">
      DOMContentLoaded
    </a>
  </ICD>
  event fires, you can listen for these events like so:
</p>
<CodeTab codes={data.code.basicUsage.eventListener} defaultTab="message.ts" />
<Callout type="info">
  Note: Make sure to add the message event listener before the DOMContentLoaded event, as browsers will queue messages received early in the page load
  (before your JavaScript code has had a chance to run) up until (but not after) the DOMContentLoaded event.
</Callout>
<h3 id="customize-headers-to-check">Customize headers to check</h3>
<p>You can customize the headers to check by setting the headersToCheck property.</p>
<CodeTab codes={data.code.basicUsage.customizeHeaders} defaultTab="sw.ts" />
<h2 id="advanced-usage">Advanced usage</h2>
<p>
  While most developers will use the module as a plugin of a particular strategy as shown above, it's possible to use the underlying logic in service
  worker code:
</p>
<CodeTab codes={data.code.advancedUsage.notifyIfUpdated} defaultTab="sw.ts" />
