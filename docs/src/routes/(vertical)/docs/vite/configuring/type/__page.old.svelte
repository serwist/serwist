<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="type">type</h1>
<h2 id="first-added">First added</h2>
<p>8.2.0</p>
<h2 id="default">Default</h2>
<Code>"classic"</Code>
<h2 id="about">About</h2>
<p>
  The module type with which the service worker should be registered. Usually used alongside
  <a class="link" href="./rollup-format"><ICD>rollupFormat</ICD></a>.
</p>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="vite.config.ts" />
<h2 id="more-resources">More resources</h2>
<p>Here is a list of resources you can read to learn more about <ICD>type</ICD>:</p>
<ul class="list">
  <li>
    <ExternalLink class="link" href="https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#type">
      MDN's reference documentation on <ICD>type</ICD>
    </ExternalLink>
  </li>
</ul>
