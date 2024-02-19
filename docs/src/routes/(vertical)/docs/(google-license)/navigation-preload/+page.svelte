<script>
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="serwist-navigation-preload">@serwist/navigation-preload</h1>
<br />
<a
  href="https://developer.chrome.com/docs/workbox/modules/workbox-navigation-preload"
  class="link"
  target="_blank"
  rel="noreferrer"
>
  Original source (Apache 2.0 License). Adapted for Serwist's usage.
</a>
<br /><br />
<h2 id="introduction">Introduction</h2>
<br />
<p>
  <ICD>@serwist/navigation-preload</ICD> is a module that allows developers to enable
  navigation preloading in their service worker.
</p>
<br />
<p>
  It will check whether navigation preloading is supported in the current
  browser, and if it is, an <ICD>activate</ICD> event handler will be automatically
  created to enable it.
</p>
<br />
<p>
  The shared code that handles making network requests across all of Serwist
  automatically takes advantage of a preload response if it's available.
</p>
<br /><br />
<h2 id="who-should-enable-navigation-preloading">
  Who should enable navigation preloading?
</h2>
<br />
<p>
  Developers who are already handling navigations by responding with precached
  HTML do not need to enable navigation preload! This feature is intended to
  reduce navigation latency for developers who can't precache their HTML, but
  still want to use Serwist to handle caching of other assets on their sites.
</p>
<br /><br />
<h2 id="basic-usage">Basic usage</h2>
<br />
<CodeTab codes={data.code.basicUsage.setup} defaultTab="sw.ts" />
