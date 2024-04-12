<script>
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="navigation-preloading">Navigation preloading</h1>
<a href="https://developer.chrome.com/docs/workbox/modules/workbox-navigation-preload" class="link" target="_blank" rel="noreferrer">
  Original source (Apache 2.0 License). Adapted for Serwist's usage.
</a>
<h2 id="introduction">Introduction</h2>
<p>
  Serwist allows developers to enable navigation preloading in their service worker through the use of the
  <ExternalLink class="link" href="https://developer.mozilla.org/en-US/docs/Web/API/NavigationPreloadManager">
    <ICD>NavigationPreloadManager</ICD>
  </ExternalLink> interface. This has to be manually enabled.
</p>
<p>
  If this functionality is enabled, Serwist will check whether navigation preloading is supported in the current browser, and if it is, an
  <ICD>activate</ICD> event handler will be automatically created to enable it.
</p>
<p>
  The shared code that handles making network requests across all of Serwist automatically takes advantage of a preload response if it's available.
</p>
<h2 id="who-should-enable-navigation-preloading">Who should enable navigation preloading?</h2>
<p>
  Developers who are already handling navigations by responding with precached HTML do not need to enable navigation preload! This feature is intended
  to reduce navigation latency for developers who can't precache their HTML, but still want to use Serwist to handle caching of other assets on their
  sites.
</p>
<h2 id="basic-usage">Basic usage</h2>
<CodeTab codes={data.code.basicUsage.setup} defaultTab="sw.ts" />
