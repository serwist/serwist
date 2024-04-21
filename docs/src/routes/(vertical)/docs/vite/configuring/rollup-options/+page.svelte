<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import Callout from "$components/Callout.svelte";

  const { data } = $props();
</script>

<h1 id="rollup-options">rollupOptions</h1>
<h2 id="first-added">First added</h2>
<p>8.2.0</p>
<h2 id="about">About</h2>
<p>Custom Rollup options used to build the service worker.</p>
<Callout type="warning">
  This does not allow output and plugins. To add Rollup/Vite plugins, use <a class="link" href="./plugins">plugins</a> instead.
</Callout>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="vite.config.ts" />
<h2 id="more-resources">More resources</h2>
<p>Here is a list of resources you can read to learn more about <ICD>rollupOptions</ICD>:</p>
<ul class="list">
  <li>
    <ExternalLink class="link" href="https://rollupjs.org/configuration-options/">
      Rollup's reference documentation on configuration options
    </ExternalLink>
  </li>
</ul>
