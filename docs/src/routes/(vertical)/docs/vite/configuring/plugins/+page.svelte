<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="plugins">plugins</h1>
<h2 id="first-added">First added</h2>
<p>8.2.0</p>
<h2 id="about">About</h2>
<p>Rollup/Vite plugins used to build the service worker.</p>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="vite.config.ts" />
<h2 id="more-resources">More resources</h2>
<p>Here is a list of resources you can read to learn more about <ICD>plugins</ICD>:</p>
<ul class="list">
  <li>
    <ExternalLink class="link" href="https://vitejs.dev/guide/using-plugins.html">
      Vite: Using plugins
    </ExternalLink>
  </li>
  <li>
    <ExternalLink class="link" href="https://vitejs.dev/guide/api-plugin.html">
      Vite: Plugin API
    </ExternalLink>
  </li>
</ul>