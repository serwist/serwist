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
    <ICD>precacheController</ICD> — An optional <ICD>PrecacheController</ICD> instance. If not provided, the singleton <ICD>PrecacheController</ICD> will
    be used.
  </li>
  <li>
    <ICD>router</ICD> — An optional <ICD>Router</ICD> instance. If not provided, the singleton <ICD>Router</ICD> will be used.
  </li>
</ul>
<h2 id="methods-and-fields">Methods and fields</h2>
<ul class="list">
  <li>
    <ICD>install(options)</ICD> — Sets the service worker up by running necessary functions and hooking up relevant service worker events.
  </li>
</ul>
<h2 id="behind-the-install-function">Behind the install function</h2>
<p>Behind the scenes, the <ICD>install</ICD> function of the class calls the following:</p>
<ul class="list">
  <li>
    <ICD>
      <ExternalLink class="link" href="https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts">
        self.importScripts
      </ExternalLink>
    </ICD> (if <ICD>importScripts</ICD> is not <ICD>undefined</ICD>)
  </li>
  <li>
    <ICD>@serwist/sw.enableNavigationPreload</ICD> (if <ICD>navigationPreload</ICD> is set to <ICD>true</ICD>)
  </li>
  <li>
    <ICD>@serwist/core.setCacheNameDetails</ICD> (if <ICD>cacheId</ICD> is not <ICD>undefined</ICD>)
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
    <ICD>@serwist/core.clientsClaim</ICD> (if <ICD>clientsClaim</ICD> is set to <ICD>true</ICD>)
  </li>
  <li>
    <ICD>
      <a class="link" href="/docs/sw/abstractions/handle-precaching">@serwist/sw.handlePrecaching</a>
    </ICD> (if <ICD>precacheEntries</ICD> is not <ICD>undefined</ICD> or empty)
  </li>
  <li>
    <ICD>
      <a class="link" href="/docs/sw/abstractions/fallbacks">@serwist/sw.fallbacks</a>
    </ICD> (if <ICD>runtimeCaching</ICD> and <ICD>fallbacks</ICD> are not <ICD>undefined</ICD>)
  </li>
  <li>
    <ICD>
      <a class="link" href="/docs/sw/abstractions/register-runtime-caching"> @serwist/sw.registerRuntimeCaching</a>
    </ICD> (if <ICD>runtimeCaching</ICD> is not <ICD>undefined</ICD>)
  </li>
  <li>
    <ICD>@serwist/sw/plugins.initializeGoogleAnalytics</ICD> (if <ICD>offlineAnalyticsConfig</ICD> is set)
  </li>
  <li>
    <a class="link" href="/docs/sw/abstractions/disable-dev-logs"><ICD>@serwist/sw.disableDevLogs</ICD></a> (if <ICD>disableDevLogs</ICD> is set to
    <ICD>true</ICD>)
  </li>
</ul>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.basicUsage} defaultTab="sw.ts" />
