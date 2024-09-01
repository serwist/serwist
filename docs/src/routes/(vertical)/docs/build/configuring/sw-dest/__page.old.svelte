<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";

  const { data } = $props();
</script>

<h1 id="sw-dest">swDest (InjectManifest only)</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>
  The path and filename of the service worker file that will be created by the build process, relative to the current working directory. It must end
  in ".js".
</p>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="build.js" />
