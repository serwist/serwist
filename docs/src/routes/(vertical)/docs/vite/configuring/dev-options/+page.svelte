<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="dev-options">devOptions</h1>
<h2 id="first-added">First added</h2>
<p>8.2.0</p>
<h2 id="about">About</h2>
<p>Development-specific options.</p>
<h2 id="options">Options</h2>
<ul class="list">
  <li>
    <ICD>bundle</ICD> — Whether the service worker should be bundled in development mode. Defaults to <ICD>true</ICD>.
  </li>
  <li>
    <ICD>minify</ICD> — Whether the service worker should be minified in development mode. Defaults to <ICD>false</ICD>.
  </li>
</ul>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="vite.config.ts" />
