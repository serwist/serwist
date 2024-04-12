<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>handlePrecaching</h1>
<h2>First added</h2>
<p>8.0.0</p>
<h2>About</h2>
<p>Handles a list of precache entries and cleans up outdated caches.</p>
<h2>How it works</h2>
<p>
  It calls <InlineCode>serwist/legacy.precacheAndRoute</InlineCode> on the list of precache entries,
  <InlineCode>serwist.cleanupOutdatedCaches</InlineCode>, and
  <InlineCode>serwist/legacy.registerRoute</InlineCode> on the
  <InlineCode>navigateFallback</InlineCode> URL.
</p>
<h2>Options</h2>
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
<h2>Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
