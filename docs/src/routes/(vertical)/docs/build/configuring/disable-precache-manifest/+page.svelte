<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>disablePrecacheManifest</h1>
<h2>First added</h2>
<p>8.0.0</p>
<h2>Default</h2>
<Code>false</Code>
<h2>About</h2>
<p>
  Whether the precache manifest should be set to <InlineCode>undefined</InlineCode>. Essentially whether <InlineCode>@serwist/build</InlineCode> should
  be disabled. Mostly useful when you want it to only check if the provided options are valid.
</p>
<h2>Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="build.js" />
