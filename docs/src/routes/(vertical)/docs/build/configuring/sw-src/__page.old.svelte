<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";

  const { data } = $props();
</script>

<h1 id="sw-src">swSrc (InjectManifest only)</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>The path to the service worker file that will be read during the build process, relative to the current working directory.</p>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="build.js" />
