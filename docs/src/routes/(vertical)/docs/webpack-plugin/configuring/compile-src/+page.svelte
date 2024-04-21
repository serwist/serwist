<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="compile-src">compileSrc</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>When <ICD>true</ICD> (the default), the <ICD>swSrc</ICD> file will be compiled by webpack.</p>
<p>
  When <ICD>false</ICD>, compilation will not occur, and <a class="link" href="./webpack-compilation-plugins"><ICD>webpackCompilationPlugins</ICD></a>
  can't be used. Set to <ICD>false</ICD> if you want to inject the manifest into, e.g., a JSON file.
</p>
<h2 id="default">Default</h2>
<Code>true</Code>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="webpack.config.js" />
