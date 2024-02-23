<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="enable">enable</h1>
<br /><br />
<h2 id="first-added">First added</h2>
<br />
<p>Workbox</p>
<br /><br />
<h2 id="about">About</h2>
<br />
<p>If the browser supports navigation preloading, then this will enable it.</p>
<br /><br />
<h2 id="parameters">Parameters</h2>
<br />
<ul class="list">
  <li>
    <ICD>headerValue</ICD> — Optional. Allows developers to override the value of the <ICD>Service-Worker-Navigation-Preload</ICD> header which will be
    sent to the server when making the navigation request.
  </li>
</ul>
<br /><br />
<h2 id="usage">Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
