<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="responses-are-same">responsesAreSame</h1>
<br /><br />
<h2 id="first-added">First added</h2>
<br />
<p>Workbox</p>
<br /><br />
<h2 id="about">About</h2>
<br />
<p>Given two responses, compares several header values to see if they are the same or not.</p>
<br /><br />
<h2 id="parameters">Parameters</h2>
<br />
<ul class="list">
  <li><ICD>firstResponse</ICD> — The first response.</li>
  <li><ICD>secondResponse</ICD> — The second response.</li>
  <li><ICD>headersToCheck</ICD> — A list of headers to check.</li>
</ul>
<br /><br />
<h2 id="usage">Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
