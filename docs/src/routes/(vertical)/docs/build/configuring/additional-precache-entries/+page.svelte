<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";

  const { data } = $props();
</script>

<h1>additionalPrecacheEntries</h1>
<h2>First added</h2>
<p>Workbox</p>
<h2>About</h2>
<p>A list of entries to be precached, in addition to any entries that are generated as part of the build configuration.</p>
<h2>Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="build.js" />
