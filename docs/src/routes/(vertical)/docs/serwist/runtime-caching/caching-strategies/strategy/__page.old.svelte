<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="strategy">Strategy</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>Abstract class for implementing runtime caching strategies.</p>
<p>
  Custom strategies should extend this class and leverage <ICD>StrategyHandler</ICD>, which will ensure all relevant cache options, fetch options, and
  plugins are used (per the current strategy instance), to perform all fetching and caching logic.
</p>
<h2 id="abstract-methods">Abstract methods</h2>
<ul class="list">
  <li>
    <ICD>_handle(request, handler)</ICD> — The main handling logic of the strategy. It is provided with two parameters:
    <ul class="list">
      <li><ICD>request</ICD> — The <ICD>Request</ICD> the strategy should return a response for.</li>
      <li>
        <ICD>handler</ICD> — The <a class="link" href="./strategy-handler"><ICD>StrategyHandler</ICD></a> instance automatically created for the current
        strategy.
      </li>
    </ul>
  </li>
</ul>
<h2 id="methods-and-fields">Methods and fields</h2>
<ul class="list">
  <li>
    <ICD>handle(options)</ICD> — Performs a request strategy and returns a <ICD>Promise</ICD> that will resolve with a <ICD>Response</ICD>, invoking
    all relevant plugin callbacks. When a strategy instance is registered with a <ICD>Route</ICD>, this method is automatically called when the route
    matches. Alternatively, this method can be used in a standalone <ICD>FetchEvent</ICD> listener by passing it to <ICD>event.respondWith()</ICD>.
  </li>
  <li>
    <ICD>handleAll(options)</ICD> — Similar to <ICD>handle()</ICD>, but instead of just returning a <ICD>Promise</ICD> that resolves to a
    <ICD>Response</ICD>, it will return an tuple of <ICD>[response, done]</ICD> promises, where <ICD>response</ICD> is equivalent to what
    <ICD>handle()</ICD> returns, and <ICD>done</ICD> is a <ICD>Promise</ICD> that will resolve once all promises added to <ICD>event.waitUntil()</ICD>
    as a part of performing the strategy have completed. You can await the <ICD>done</ICD> promise to ensure any extra work performed by the strategy (usually
    caching responses) completes successfully.
  </li>
</ul>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
<h2 id="more-resources">More resources</h2>
<p>Here is a list of resources you can read to learn more about <ICD>Strategy</ICD>:</p>
<ul class="list">
  <li>
    <a class="link" href="/docs/serwist/runtime-caching">Runtime caching</a>
  </li>
  <li>
    <a class="link" href="/docs/serwist/runtime-caching/plugins">Using plugins</a>
  </li>
  <li>
    <a class="link" href="./strategy-handler"><ICD>StrategyHandler</ICD>'s reference documentation</a>
  </li>
</ul>
