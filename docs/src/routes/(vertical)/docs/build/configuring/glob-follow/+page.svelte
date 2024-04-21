<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>globFollow</h1>
<h2>First added</h2>
<p>Workbox</p>
<h2>Default</h2>
<Code>true</Code>
<h2>About</h2>
<p>
  Determines whether or not symlinks are followed when generating the precache manifest. For more information, see the definition of
  <InlineCode>follow</InlineCode> in
  <a class="link" target="_blank" rel="noreferrer" href="https://github.com/isaacs/node-glob#options">glob's documentation</a>.
</p>
<h2>Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="build.js" />
