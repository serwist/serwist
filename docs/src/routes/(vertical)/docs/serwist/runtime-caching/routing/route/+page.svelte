<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="route">Route</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>
  A <ICD>Route</ICD> consists of a pair of callback functions, <ICD>match</ICD> and <ICD>handler</ICD>. The <ICD>match</ICD> callback determines if a route
  should be used to handle a request by returning a truthy value if it can. The <ICD>handler</ICD> callback is called when the route matches and should
  return a <ICD>Promise</ICD> that resolves to a <ICD>Response</ICD>.
</p>
<h2 id="parameters">Parameters</h2>
<ul class="list">
  <li>
    <ICD>match</ICD> — A callback function that determines whether the route matches a given <ICD>fetch</ICD> event by returning a truthy value.
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
<p>Here is a list of resources you can read to learn more about <ICD>Route</ICD>:</p>
<ul class="list">
  <li>
    <a class="link" href="/docs/serwist/runtime-caching/routing#route-matching">Routing: Applying caching strategies with route matching</a>
  </li>
</ul>
