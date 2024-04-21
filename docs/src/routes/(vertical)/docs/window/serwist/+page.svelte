<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="serwist">Serwist</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>A class to aid in handling service worker registration, updates, and reacting to service worker lifecycle events.</p>
<h2 id="parameters">Parameters</h2>
<ul class="list">
  <li>
    <ICD>scriptURL</ICD> — The service worker script associated with this instance. Using a
    <ExternalLink class="link" href="https://developer.mozilla.org/en-US/docs/Web/API/TrustedScriptURL">TrustedScriptURL</ExternalLink> is supported.
  </li>
  <li>
    <ICD>registerOptions</ICD> — The service worker options associated with this instance.
  </li>
</ul>
<h2 id="methods-and-fields">Methods and fields</h2>
<ul class="list">
  <li>
    <ICD>{"async register({ immediate = false })"}</ICD> — Registers a service worker for this instances script URL and service worker options. By default
    this method delays registration until after the window has loaded.
  </li>
  <li>
    <ICD>async update()</ICD> — Checks for updates of the registered service worker.
  </li>
  <li>
    <ICD>active</ICD> — Resolves to the service worker registered by this instance as soon as it is active. If a service worker was already controlling
    at registration time then it will resolve to that if the script URLs (and optionally script versions) match, otherwise it will wait until an update
    is found and activates.
  </li>
  <li>
    <ICD>controlling</ICD> — Resolves to the service worker registered by this instance as soon as it is controlling the page. If a service worker was
    already controlling at registration time then it will resolve to that if the script URLs (and optionally script versions) match, otherwise it will
    wait until an update is found and starts controlling the page. Note: the first time a service worker is installed it will activate but not start controlling
    the page unless <ICD>clients.claim()</ICD> is called in the service worker.
  </li>
  <li>
    <ICD>getSW()</ICD> — Resolves with a reference to a service worker that matches the script URL of this instance, as soon as it's available. If, at
    registration time, there's already an active or waiting service worker with a matching script URL, it will be used (with the waiting service worker
    taking precedence over the active service worker if both match, since the waiting service worker would have been registered more recently). If there's
    no matching active or waiting service worker at registration time then the promise will not resolve until an update is found and starts installing,
    at which point the installing service worker is used.
  </li>
  <li>
    <ICD>async messageSW(event)</ICD> — Sends the passed data object to the service worker registered by this instance (via <ICD>getSW()</ICD>) and
    resolves with a response (if any). A response can be sent by calling <ICD>event.ports[0].postMessage(...)</ICD> in the service worker, which will resolve
    the promise returned by <ICD>messageSW()</ICD>. If no response is sent, the promise will never resolve.
  </li>
  <li>
    <ICD>messageSkipWaiting()</ICD> — Sends a <ICD>{`{ type: "SKIP_WAITING" }`}</ICD> message to the service worker that is currently waiting and associated
    with the current registration. If there is no current registration, or no service worker is waiting, calling this will have no effect.
  </li>
  <li>
    <ICD>handleCache(event)</ICD> — Caches new URLs on demand. Call this method from the service worker's <ICD>message</ICD> event. To trigger the handler,
    send a message of type <ICD>"CACHE_URLS"</ICD> alongside a list of URLs that should be cached as <ICD>urlsToCache</ICD>.
  </li>
</ul>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="index.ts" />
<h2 id="more-resources">More resources</h2>
<p>Here is a list of resources you can read to learn more about <ICD>Serwist</ICD>:</p>
<ul class="list">
  <li>
    <a class="link" href="/docs/window">
      Serwist's guide on using <ICD>@serwist/window</ICD>
    </a>
  </li>
  <li>
    <ExternalLink class="link" href="https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#options">
      MDN's reference documentation on <ICD>registerOptions</ICD>
    </ExternalLink>
  </li>
</ul>
