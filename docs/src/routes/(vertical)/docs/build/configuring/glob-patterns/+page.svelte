<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";

  const { data } = $props();
</script>

<h1>globPatterns</h1>
<h2>First added</h2>
<p>Workbox</p>
<h2>Default</h2>
<Code>{'["**/*.{js,css,html}"]'}</Code>
<h2>About</h2>
<p>
  Files matching any of these patterns will be included in the precache manifest. For more information, see
  <a class="link" target="_blank" rel="noreferrer" href="https://github.com/isaacs/node-glob#glob-primer">glob's Glob Primer</a>.
</p>
<h2>Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="build.js" />
