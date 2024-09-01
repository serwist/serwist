<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="rollup-format">rollupFormat</h1>
<h2 id="first-added">First added</h2>
<p>8.2.0</p>
<h2 id="default">Default</h2>
<Code>"es"</Code>
<h2 id="about">About</h2>
<p>
  The format used to build the service worker. Usually used alongside
  <a class="link" href="./type"><ICD>type</ICD></a>.
</p>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="vite.config.ts" />
<h2 id="more-resources">More resources</h2>
<p>Here is a list of resources you can read to learn more about <ICD>rollupFormat</ICD>:</p>
<ul class="list">
  <li>
    <ExternalLink class="link" href="https://caniuse.com/mdn-api_serviceworker_ecmascript_modules">
      Browser compatibility data table for ES modules in service workers
    </ExternalLink>
  </li>
  <li>
    <ExternalLink class="link" href="https://web.dev/articles/es-modules-in-sw">web.dev: ES modules in service workers</ExternalLink>
  </li>
</ul>
