<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<h1>disablePrecacheManifest</h1>
<br /><br />
<h2>First added</h2>
<br />
<p>8.0.0</p>
<br /><br />
<h2>Default</h2>
<br />
<Code>false</Code>
<br /><br />
<h2>About</h2>
<br />
<p>
  Whether the precache manifest should be set to <InlineCode>undefined</InlineCode>. Essentially whether <InlineCode>@serwist/build</InlineCode> should
  be disabled. Mostly useful when you want it to only check if the provided options are valid.
</p>
<br /><br />
<h2>Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="build.ts" />
