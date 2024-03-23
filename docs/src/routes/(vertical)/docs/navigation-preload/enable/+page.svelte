<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="enable">enable</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>If the browser supports navigation preloading, then this will enable it.</p>
<h2 id="parameters">Parameters</h2>
<ul class="list">
  <li>
    <ICD>headerValue</ICD> — Optional. Allows developers to override the value of the <ICD>Service-Worker-Navigation-Preload</ICD> header which will be
    sent to the server when making the navigation request.
  </li>
</ul>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
