<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<h1>maximumFileSizeToCacheInBytes</h1>
<br /><br />
<h2>First added</h2>
<br />
<p>Workbox</p>
<br /><br />
<h2>Default</h2>
<br />
<Code>2097152</Code>
<br /><br />
<h2>About</h2>
<br />
<p>
  This value can be used to determine the maximum size of files that will be precached. This prevents you from inadvertently precaching very large
  files that might have accidentally matched one of your patterns.
</p>
<br /><br />
<h2>Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="build.ts" />
