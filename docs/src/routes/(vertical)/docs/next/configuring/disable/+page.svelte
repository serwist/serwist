<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<h1>disable</h1>
<br /><br />
<h2>First added</h2>
<br />
<Code>next-pwa</Code>
<br /><br />
<h2>Default</h2>
<br />
<Code>false</Code>
<br /><br />
<h2>About</h2>
<br />
<p>Whether Serwist should be disabled.</p>
<br /><br />
<h2>Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="next.config.mjs" />
