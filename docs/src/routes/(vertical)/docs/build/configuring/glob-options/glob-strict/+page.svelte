<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>globStrict</h1>
<h2>First added</h2>
<p>Workbox</p>
<h2>Default</h2>
<Code>true</Code>
<h2>About</h2>
<p>
  If true, an error reading a directory when generating a precache manifest will cause the build to fail. If false, the problematic directory will be
  skipped. For more information, see the definition of <InlineCode>strict</InlineCode> in
  <a class="link" target="_blank" rel="noreferrer" href="https://github.com/isaacs/node-glob#options">glob's documentation</a>.
</p>
<h2>Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="build.js" />
