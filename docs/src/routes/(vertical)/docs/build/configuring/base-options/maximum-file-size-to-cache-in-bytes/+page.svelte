<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";

  const { data } = $props();
</script>

<h1>maximumFileSizeToCacheInBytes</h1>
<h2>First added</h2>
<p>Workbox</p>
<h2>Default</h2>
<Code>2097152</Code>
<h2>About</h2>
<p>
  This value can be used to determine the maximum size of files that will be precached. This prevents you from inadvertently precaching very large
  files that might have accidentally matched one of your patterns.
</p>
<h2>Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="build.js" />
