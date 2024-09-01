<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";

  const { data } = $props();
</script>

<h1 id="mode">mode</h1>
<h2 id="first-added">First added</h2>
<p>8.2.0</p>
<h2 id="default">Default</h2>
<Code>process.env.NODE_ENV</Code>
<h2 id="about">About</h2>
<p>The mode in which your service worker should be built.</p>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="vite.config.ts" />
