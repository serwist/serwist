<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="responses-are-same">responsesAreSame</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>Given two responses, compares several header values to see if they are the same or not.</p>
<h2 id="parameters">Parameters</h2>
<ul class="list">
  <li><ICD>firstResponse</ICD> — The first response.</li>
  <li><ICD>secondResponse</ICD> — The second response.</li>
  <li><ICD>headersToCheck</ICD> — A list of headers to check.</li>
</ul>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
