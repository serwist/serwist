<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<h1>reloadOnOnline</h1>
<br /><br />
<h2>First added</h2>
<br />
<Code>next-pwa</Code>
<br /><br />
<h2>Default</h2>
<br />
<Code>true</Code>
<br /><br />
<h2>About</h2>
<br />
<p>Whether Serwist should reload the app when it goes online.</p>
<br /><br />
<h2>How it works</h2>
<br />
<p>
  When this is set to <InlineCode>true</InlineCode>, the code injected into your app's entrypoints adds an event listener that runs
  <InlineCode>location.reload()</InlineCode> to window's "online" event.
</p>
<br /><br />
<h2>Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="next.config.mjs" />
