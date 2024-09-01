<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="chunks">chunks</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>One or more chunk names whose corresponding output files should be included in the precache manifest.</p>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="webpack.config.js" />
<h2 id="more-resources">More resources</h2>
<p>Here is a list of resources you can read to learn more about <ICD>chunks</ICD>:</p>
<ul class="list">
  <li>
    <ExternalLink class="link" href="https://webpack.js.org/plugins/split-chunks-plugin/#splitchunksname">
      webpack's reference documentation on <ICD>splitChunks.name</ICD>
    </ExternalLink>
  </li>
</ul>
