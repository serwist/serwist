<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="include">include</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>
  One or more specifiers used to include assets from the precache manifest. This is interpreted following the same rules as webpack's standard
  <ICD>include</ICD> option.
</p>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="webpack.config.js" />
<h2 id="more-resources">More resources</h2>
<p>Here is a list of resources you can read to learn more about <ICD>include</ICD>:</p>
<ul class="list">
  <li>
    <ExternalLink class="link" href="https://webpack.js.org/configuration/module/#condition">
      webpack's reference documentation on <ICD>Condition</ICD>
    </ExternalLink>
  </li>
</ul>
