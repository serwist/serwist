<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ETL from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="navigation-route">NavigationRoute</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>
  <ICD>NavigationRoute</ICD> makes it easy to create a <ICD>Route</ICD> object that matches navigation requests.
</p>
<p>
  It will only match incoming Requests whose <ETL class="link" href="https://fetch.spec.whatwg.org/#concept-request-mode"><ICD>mode</ICD></ETL> is set
  to <ICD>"navigate"</ICD>.
</p>
<p>
  You can optionally only apply this route to a subset of navigation requests by using one or both of the <ICD>denylist</ICD> and <ICD>allowlist</ICD>
  parameters.
</p>
<p>
  If both <ICD>denylist</ICD> and <ICD>allowlist</ICD> are provided, <ICD>denylist</ICD> will take precedence.
</p>
<p>
  The regular expressions in <ICD>allowlist</ICD> and <ICD>denylist</ICD>
  are matched against the concatenated <ETL class="link" href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/pathname">
    <ICD>pathname</ICD>
  </ETL> and <ETL class="link" href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search"><ICD>search</ICD></ETL>
  portions of the requested URL.
</p>
<h2 id="parameters">Parameters</h2>
<ul class="list">
  <li>
    <ICD>handler</ICD> — A callback function that returns a <ICD>Promise</ICD> resolving to a <ICD>Response</ICD>.
  </li>
  <li>
    <ICD>options</ICD> — Options for <ICD>NavigationRoute</ICD>:
    <ul class="list">
      <li>
        <ICD>allowlist</ICD> — A list of <ICD>RegExp</ICD> objects matching URLs that should match this route.
      </li>
      <li>
        <ICD>denylist</ICD> — A list of <ICD>RegExp</ICD> objects matching URLs that should not match this route.
      </li>
    </ul>
  </li>
</ul>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
<h2 id="more-resources">More resources</h2>
<p>Here is a list of resources you can read to learn more about <ICD>NavigationRoute</ICD>:</p>
<ul class="list">
  <li>
    <a class="link" href="/docs/serwist/runtime-caching/routing#registering-navigation-route">Routing: Matching all navigation requests</a>
  </li>
</ul>
