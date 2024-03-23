<script>
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>installSerwist</h1>
<h2>First added</h2>
<p>8.0.0</p>
<h2>About</h2>
<p>Abstracts away the core APIs of Serwist.</p>
<h2>Why?</h2>
<p>
  Workbox, of which Serwist is a fork, has a feature called GenerateSW, which was removed from Serwist due to it being deemed a burden on the
  codebase. This was because its implementation required Serwist to manually stringify the
  <InlineCode>runtimeCaching</InlineCode> array, which was unnecessarily error-prone and tedious. As a result,
  <InlineCode>installSerwist</InlineCode> was created as an alternative, allowing you to use InjectManifest the way you would with GenerateSW.
</p>
<h2>Behind the scenes</h2>
<p>This function calls the following:</p>
<ul class="list">
  <li>
    <InlineCode>
      <a
        class="link"
        href="https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts"
        target="_blank"
        rel="noopener noreferrer"
      >
        self.importScripts
      </a>
    </InlineCode> (if its <InlineCode>importScripts</InlineCode> is not
    <InlineCode>undefined</InlineCode>)
  </li>
  <li>
    <InlineCode>@serwist/navigation-preload.enable</InlineCode> (if its
    <InlineCode>navigationPreload</InlineCode>
    is set to <InlineCode>true</InlineCode>)
  </li>
  <li>
    <InlineCode>@serwist/core.setCacheNameDetails</InlineCode> (if its
    <InlineCode>cacheId</InlineCode> is not
    <InlineCode>undefined</InlineCode>)
  </li>
  <li>
    <InlineCode>
      <a
        class="link"
        href="https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting"
        target="_blank"
        rel="noopener noreferrer"
      >
        self.skipWaiting
      </a>
    </InlineCode> in the following situations:
    <ul class="list">
      <li>
        Its <InlineCode>skipWaiting</InlineCode> is set to
        <InlineCode>true</InlineCode>.
      </li>
      <li>
        Otherwise, when a message with the argument
        <InlineCode>type</InlineCode> equal to
        <InlineCode>"SKIP_WAITING"</InlineCode> is sent to the service worker.
      </li>
    </ul>
  </li>
  <li>
    <InlineCode>@serwist/core.clientsClaim</InlineCode> (if its
    <InlineCode>clientsClaim</InlineCode> is set to
    <InlineCode>true</InlineCode>)
  </li>
  <li>
    <InlineCode>
      <a class="link" href="/docs/sw/handle-precaching">@serwist/sw.handlePrecaching</a>
    </InlineCode> (its arguments are passed as-is)
  </li>
  <li>
    <InlineCode>
      <a class="link" href="/docs/sw/fallbacks">@serwist/sw.fallbacks</a>
    </InlineCode> (if its <InlineCode>runtimeCaching</InlineCode> and
    <InlineCode>fallbacks</InlineCode> are not <InlineCode>undefined</InlineCode>)
  </li>
  <li>
    <InlineCode>
      <a class="link" href="/docs/sw/register-runtime-caching"> @serwist/sw.registerRuntimeCaching </a>
    </InlineCode> (if its <InlineCode>runtimeCaching</InlineCode> is not
    <InlineCode>undefined</InlineCode>)
  </li>
  <li>
    <InlineCode>@serwist/google-analytics/initialize.initialize</InlineCode> (if its <InlineCode>offlineAnalyticsConfig</InlineCode> is set)
  </li>
  <li>
    <InlineCode>
      <a class="link" href="/docs/sw/disable-dev-logs"> @serwist/sw.disableDevLogs </a>
    </InlineCode> (if its <InlineCode>disableDevLogs</InlineCode> is set to
    <InlineCode>true</InlineCode>)
  </li>
</ul>
<h2>Usage</h2>
<CodeTab codes={data.code.basicUsage} defaultTab="sw.ts" />
