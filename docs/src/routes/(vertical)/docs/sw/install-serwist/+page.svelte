<script>
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>installSerwist</h1>
<br /><br />
<h2>First added</h2>
<br />
<p>8.0.0</p>
<br /><br />
<h2>About</h2>
<br />
<p>A function that abstracts away the core APIs of Serwist.</p>
<br /><br />
<h2>Why?</h2>
<br />
<p>
  Workbox, which Serwist derived from, has a feature called GenerateSW, which was removed from Serwist due to it being deemed a burden on the
  codebase. This was because its implementation required Serwist to manually stringify the
  <InlineCode>runtimeCaching</InlineCode> array, which was unnecessarily error-prone and tedious. As a result,
  <InlineCode>installSerwist</InlineCode> was created as an alternative, allowing you to use InjectManifest the way you would with GenerateSW.
</p>
<br /><br />
<h2>Behind the scenes</h2>
<br />
<p>This function calls the following:</p>
<br />
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
    </InlineCode> (if its <InlineCode>importScripts</InlineCode> is not <InlineCode>undefined</InlineCode>)
  </li>
  <li>
    <InlineCode>@serwist/navigation-preload.enable</InlineCode> (if its <InlineCode>navigationPreload</InlineCode> is set to
    <InlineCode>true</InlineCode>)
  </li>
  <li>
    <InlineCode>@serwist/core.setCacheNameDetails</InlineCode> (if its <InlineCode>cacheId</InlineCode> is not <InlineCode>undefined</InlineCode>)
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
        Its <InlineCode>skipWaiting</InlineCode> is set to <InlineCode>true.</InlineCode>
      </li>
      <li>
        Otherwise, a message with the argument <InlineCode>type</InlineCode> equal to <InlineCode>"SKIP_WAITING"</InlineCode> is sent to the service worker.
      </li>
    </ul>
  </li>
  <li>
    <InlineCode>@serwist/core.clientsClaim</InlineCode> (if its <InlineCode>clientsClaim</InlineCode> is set to <InlineCode>true</InlineCode>)
  </li>
  <li>
    <InlineCode>@serwist/sw.handlePrecaching</InlineCode> (its arguments are passed as-is)
  </li>
  <li>
    <InlineCode>@serwist/sw.fallbacks</InlineCode> (if its <InlineCode>runtimeCaching</InlineCode> and
    <InlineCode>fallbacks</InlineCode> are not <InlineCode>undefined</InlineCode>)
  </li>
  <li>
    <InlineCode>@serwist/sw.registerRuntimeCaching</InlineCode> (if its <InlineCode>runtimeCaching</InlineCode> is not
    <InlineCode>undefined</InlineCode>)
  </li>
  <li>
    <InlineCode>@serwist/google-analytics/initialize.initialize</InlineCode> (if its <InlineCode>offlineAnalyticsConfig</InlineCode> is set)
  </li>
  <li>
    <InlineCode>@serwist/sw.disableDevLogs</InlineCode> (if its <InlineCode>disableDevLogs</InlineCode> is set to
    <InlineCode>true</InlineCode>)
  </li>
</ul>
<br /><br />
<h2>Usage</h2>
<br />
<CodeTab codes={data.code.basicUsage} defaultTab="sw.ts" />
