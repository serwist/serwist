<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="base">base</h1>
<h2 id="first-added">First added</h2>
<p>8.2.0</p>
<h2 id="default">Default</h2>
<Code>viteOptions.base</Code>
<h2 id="about">About</h2>
<p>The base from which Serwist resolves URLs.</p>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="vite.config.ts" />
<h2 id="more-resources">More resources</h2>
<p>Here is a list of resources you can read to learn more about <ICD>base</ICD>:</p>
<ul class="list">
  <li>
    <ExternalLink class="link" href="https://vitejs.dev/config/shared-options.html#base">
      Vite's reference documentation on <ICD>base</ICD>
    </ExternalLink>
  </li>
</ul>
