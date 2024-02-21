<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<h1>additionalPrecacheEntries</h1>
<br /><br />
<h2>First added</h2>
<br />
<p>Workbox</p>
<br /><br />
<h2>About</h2>
<br />
<p>A list of entries to be precached, in addition to any entries that are generated as part of the build configuration.</p>
<br /><br />
<h2>Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="build.ts" />
