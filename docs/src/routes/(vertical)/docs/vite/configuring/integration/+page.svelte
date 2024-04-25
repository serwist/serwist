<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="integration">integration</h1>
<h2 id="first-added">First added</h2>
<p>8.2.0</p>
<h2 id="about">About</h2>
<p>Hooks of the build lifecycle.</p>
<h2 id="options">Options</h2>
<ul class="list">
  <li>
    <ICD>beforeBuildServiceWorker(options)</ICD> — Allows you to run some logic before the service worker is built.
  </li>
  <li>
    <ICD>closeBundleOrder</ICD> — Adjusts the application order of <ICD>@serwist/vite</ICD>'s <ICD>closeBundle</ICD> hook.
  </li>
  <li>
    <ICD>configureOptions(viteOptions, options)</ICD> — Allows you to configure the options of Serwist and Vite. Useful when there is a dependency between
    the two.
  </li>
</ul>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="vite.config.ts" />
