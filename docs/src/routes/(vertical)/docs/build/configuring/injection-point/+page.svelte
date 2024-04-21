<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="injection-point">injectionPoint (InjectManifest only)</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>The string to find inside of the <ICD>swSrc</ICD> file. Once found, it will be replaced by the generated precache manifest.</p>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="build.js" />
