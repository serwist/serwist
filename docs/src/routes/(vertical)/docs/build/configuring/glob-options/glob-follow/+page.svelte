<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<h1>globFollow</h1>
<br /><br />
<h2>First added</h2>
<br />
<p>Workbox</p>
<br /><br />
<h2>Default</h2>
<br />
<Code>true</Code>
<br /><br />
<h2>About</h2>
<br />
<p>
  Determines whether or not symlinks are followed when generating the precache manifest. For more information, see the definition of
  <InlineCode>follow</InlineCode> in
  <a class="link" target="_blank" rel="noreferrer" href="https://github.com/isaacs/node-glob#options">glob's documentation</a>.
</p>
<br /><br />
<h2>Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="build.js" />
