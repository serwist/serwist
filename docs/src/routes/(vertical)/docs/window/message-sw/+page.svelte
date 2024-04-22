<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="message-sw">messageSW</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>Sends a data object to a service worker via <ICD>postMessage</ICD> and resolves with a response (if any).</p>
<p>
  A response can be sent by calling <ICD>event.ports[0].postMessage(...)</ICD> in the service worker, which will resolve the promise returned by
  <ICD>messageSW()</ICD>. If no response is sent, the promise will never resolve.
</p>
<h2 id="parameters">Parameters</h2>
<ul class="list">
  <li><ICD>sw</ICD> — The service worker to send the message to.</li>
  <li><ICD>data</ICD> — An object to send to the service worker.</li>
</ul>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="index.ts" />
