<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<h1>globPatterns</h1>
<br /><br />
<h2>First added</h2>
<br />
<p>Workbox</p>
<br /><br />
<h2>Default</h2>
<br />
<Code>{['"**\\/*.{js,css,html}"']}</Code>
<br /><br />
<h2>About</h2>
<br />
<p>
  Files matching any of these patterns will be included in the precache manifest. For more information, see
  <a class="link" target="_blank" rel="noreferrer" href="https://github.com/isaacs/node-glob#glob-primer">glob's Glob Primer</a>.
</p>
<br /><br />
<h2>Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="build.js" />
