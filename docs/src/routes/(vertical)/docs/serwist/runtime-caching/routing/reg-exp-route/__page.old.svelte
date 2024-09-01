<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="reg-exp-route">RegExpRoute</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>
  <ICD>RegExpRoute</ICD> makes it easy to create a <ICD>Route</ICD> object with a regular expression.
</p>
<p>
  For same-origin requests the <ICD>RegExp</ICD> only needs to match part of the URL. For requests against third-party servers, you must define a
  <ICD>RegExp</ICD> that matches the start of the URL.
</p>
<h2 id="parameters">Parameters</h2>
<ul class="list">
  <li>
    <ICD>regExp</ICD> — The regular expression to match against URLs.
  </li>
  <li>
    <ICD>handler</ICD> — A callback function that returns a <ICD>Promise</ICD> resolving to a <ICD>Response</ICD>.
  </li>
  <li>
    <ICD>method</ICD> — The HTTP method to match the route against. Defaults to <ICD>GET</ICD>.
  </li>
</ul>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
<h2 id="more-resources">More resources</h2>
<p>Here is a list of resources you can read to learn more about <ICD>RegExpRoute</ICD>:</p>
<ul class="list">
  <li>
    <a class="link" href="/docs/serwist/runtime-caching/routing#route-matching">Routing: Applying caching strategies with route matching</a>
  </li>
</ul>
