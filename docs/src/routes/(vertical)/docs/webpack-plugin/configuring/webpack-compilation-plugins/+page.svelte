<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="webpack-compilation-plugins">webpackCompilationPlugins</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>
  Optional webpack plugins that will be used when compiling the <ICD>swSrc</ICD> file. Only valid if <ICD>compileSrc</ICD> is <ICD>true</ICD>.
</p>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="webpack.config.js" />
<h2 id="more-resources">More resources</h2>
<p>Here is a list of resources you can read to learn more about <ICD>webpackCompilationPlugins</ICD>:</p>
<ul class="list">
  <li>
    <ExternalLink class="link" href="https://webpack.js.org/plugins/">
      webpack: Plugins
    </ExternalLink>
  </li>
</ul>
