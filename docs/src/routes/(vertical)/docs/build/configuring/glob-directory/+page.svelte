<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>globDirectory</h1>
<h2>First added</h2>
<p>Workbox</p>
<h2>About</h2>
<p>The local directory you wish to match <InlineCode>globPatterns</InlineCode> against. The path is relative to the current directory.</p>
<h2>Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="build.js" />
