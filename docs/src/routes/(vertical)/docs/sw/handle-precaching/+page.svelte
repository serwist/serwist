<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>handlePrecaching</h1>
<br /><br />
<h2>First added</h2>
<br />
<p>8.0.0</p>
<br /><br />
<h2>About</h2>
<br />
<p>Handles a list of precache entries and cleans up outdated caches.</p>
<br /><br />
<h2>How it works</h2>
<br />
<p>
  It calls <InlineCode>@serwist/precaching.precacheAndRoute</InlineCode> on the list of precache entries,
  <InlineCode>@serwist/precaching.cleanupOutdatedCaches</InlineCode>, and
  <InlineCode>@serwist/routing.registerRoute</InlineCode> on the
  <InlineCode>navigateFallback</InlineCode> URL.
</p>
<br /><br />
<h2>Options</h2>
<br />
<ul class="list">
  <li>
    <InlineCode>precacheEntries</InlineCode> — A list of precache entries.
  </li>
  <li>
    <InlineCode>precacheOptions</InlineCode> — Precache options for the provided entries.
  </li>
  <li>
    <InlineCode>cleanupOutdatedCaches</InlineCode> — Whether outdated caches should be removed. Defaults to <InlineCode>false</InlineCode>.
  </li>
  <li>
    <InlineCode>navigateFallback</InlineCode> — An URL that should point to a HTML file with which navigation requests for URLs that aren't precached will
    be fulfilled.
  </li>
  <li>
    <InlineCode>navigateFallbackAllowlist</InlineCode> — URLs that should be allowed to use the <InlineCode>navigateFallback</InlineCode> handler.
  </li>
  <li>
    <InlineCode>navigateFallbackDenylist</InlineCode> — URLs that should not be allowed to use the <InlineCode>navigateFallback</InlineCode> handler. This
    takes precedence over <InlineCode>navigateFallbackAllowlist</InlineCode>.
  </li>
</ul>
<br /><br />
<h2>Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
